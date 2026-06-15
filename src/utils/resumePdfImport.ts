import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.mjs?url';
import type {
  CertificationEntry,
  EducationEntry,
  ExperienceEntry,
  ProjectEntry,
  ResumeData,
  SkillCategory,
} from '../types/resume';
import { createDefaultResume, createId } from './defaults';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

type PdfTextItem = {
  str: string;
  transform?: number[];
};

export interface ResumePdfImportOptions {
  preferOcr?: boolean;
  onStatus?: (status: string) => void;
}

const SECTION_ALIASES: Record<string, string[]> = {
  summary: ['summary', 'profile', 'professional summary', 'about'],
  skills: [
    'skills',
    'technical skills',
    'core skills',
    'technologies',
    'languages',
  ],
  experience: [
    'experience',
    'experiences',
    'work experience',
    'work experiences',
    'professional experience',
    'professional experiences',
    'employment',
    'employment history',
  ],
  education: ['education', 'academic background'],
  projects: [
    'projects',
    'selected projects',
    'project experience',
    'activities',
  ],
  certifications: ['certifications', 'certificates', 'licenses'],
};

const ALL_SECTION_NAMES = Object.values(SECTION_ALIASES).flat();

function normalizeLine(line: string): string {
  return line.replace(/\s+/g, ' ').trim();
}

function isLikelySectionHeading(line: string): boolean {
  const normalized = normalizeLine(line).toLowerCase().replace(/:$/, '');
  return ALL_SECTION_NAMES.includes(normalized);
}

function findSectionKey(line: string): string | null {
  const normalized = normalizeLine(line).toLowerCase().replace(/:$/, '');
  return (
    Object.entries(SECTION_ALIASES).find(([, aliases]) =>
      aliases.includes(normalized),
    )?.[0] ?? null
  );
}

function splitIntoSections(lines: string[]): Record<string, string[]> {
  const sections: Record<string, string[]> = {};
  let current = 'header';

  for (const line of lines) {
    const key = findSectionKey(line);
    if (key) {
      current = key;
      sections[current] = sections[current] ?? [];
      continue;
    }

    sections[current] = sections[current] ?? [];
    sections[current].push(line);
  }

  return sections;
}

function inferSummaryFromHeader(sections: Record<string, string[]>): void {
  if (sections.summary?.length) return;

  const header = sections.header ?? [];
  const summaryStart = header.findIndex((line) => {
    const wordCount = line.split(' ').length;
    return wordCount >= 8 && !line.includes('@') && !extractPhone(line);
  });

  if (summaryStart < 0) return;

  sections.summary = header.slice(summaryStart);
  sections.header = header.slice(0, summaryStart);
}

function extractEmail(text: string): string {
  return text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] ?? '';
}

function extractPhone(text: string): string {
  return (
    text
      .match(/(?:\+?\d[\d\s().-]{7,}\d)/)?.[0]
      .replace(/\s+/g, ' ')
      .trim() ?? ''
  );
}

function extractUrl(text: string, keyword?: string): string {
  const searchableText = text.replace(
    /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi,
    ' ',
  );
  const urls =
    searchableText.match(
      /(?:https?:\/\/)?(?:www\.)?[a-z0-9.-]+\.[a-z]{2,}(?:\/[^\s,;)]*)?/gi,
    ) ?? [];
  if (!keyword) {
    return urls.find((url) => !/linkedin|github/i.test(url)) ?? '';
  }
  return urls.find((url) => url.toLowerCase().includes(keyword)) ?? '';
}

function extractName(
  headerLines: string[],
  email: string,
  phone: string,
): string {
  return (
    headerLines.find((line) => {
      const lower = line.toLowerCase();
      return (
        line.length >= 2 &&
        line.length <= 80 &&
        !line.includes('@') &&
        !line.includes('://') &&
        !lower.includes('linkedin') &&
        !lower.includes('github') &&
        line !== phone &&
        line !== email
      );
    }) ?? ''
  );
}

function extractTitle(headerLines: string[], name: string): string {
  return (
    headerLines.find((line) => {
      const lower = line.toLowerCase();
      return (
        line !== name &&
        line.length <= 90 &&
        !line.includes('@') &&
        !line.match(/\b(19|20)\d{2}\b/) &&
        !extractUrl(line) &&
        !lower.includes('linkedin') &&
        !lower.includes('github') &&
        !extractPhone(line)
      );
    }) ?? ''
  );
}

function cleanBullet(line: string): string {
  return normalizeLine(line)
    .replace(/^[-*•▪●○\d.)\s]+/, '')
    .trim();
}

function splitDelimitedLine(line: string): string[] {
  return line
    .split(/\s+(?:[|–—-]|·)\s+/)
    .map(normalizeLine)
    .filter(Boolean);
}

function stripDates(line: string): string {
  return normalizeLine(
    line
      .replace(
        /(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\.?\s+(?:19|20)\d{2}\s*(?:[–—-]\s*(?:(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\.?\s+)?(?:19|20)\d{2}|present|current)?/gi,
        '',
      )
      .replace(
        /\b(?:19|20)\d{2}\s*(?:[–—-]\s*(?:(?:19|20)\d{2}|present|current))?/gi,
        '',
      ),
  );
}

function splitEntries(lines: string[]): string[][] {
  const entries: string[][] = [];
  let current: string[] = [];

  for (const line of lines.filter(Boolean)) {
    if (
      current.length > 0 &&
      !line.match(/^[-*•▪●○]/) &&
      looksLikeEntryStart(line)
    ) {
      entries.push(current);
      current = [];
    }
    current.push(line);
  }

  if (current.length > 0) entries.push(current);
  return entries;
}

function groupTextItemsByRows(items: PdfTextItem[]): string {
  const rows = items
    .filter((item) => item.str.trim())
    .map((item) => ({
      text: item.str,
      x: item.transform?.[4] ?? 0,
      y: item.transform?.[5] ?? 0,
    }))
    .sort((a, b) => b.y - a.y || a.x - b.x)
    .reduce<Array<{ y: number; items: Array<{ text: string; x: number }> }>>(
      (result, item) => {
        const row = result.find(
          (candidate) => Math.abs(candidate.y - item.y) < 4,
        );
        if (row) {
          row.items.push({ text: item.text, x: item.x });
          return result;
        }

        result.push({ y: item.y, items: [{ text: item.text, x: item.x }] });
        return result;
      },
      [],
    );

  return rows
    .map((row) =>
      row.items
        .sort((a, b) => a.x - b.x)
        .map((item) => item.text)
        .join(' '),
    )
    .join('\n');
}

function scoreResumeTextQuality(text: string): number {
  const lines = text.split(/\r?\n/).map(normalizeLine).filter(Boolean);
  const sections = splitIntoSections(lines);
  const sectionCount = Object.keys(sections).filter(
    (key) => key !== 'header' && (sections[key]?.length ?? 0) > 0,
  ).length;
  const hasContact = Boolean(extractEmail(text) || extractPhone(text));
  const hasEntries = lines.some((line) =>
    Boolean(extractDates(line).startDate),
  );

  return [
    text.trim().length >= 120,
    lines.length >= 8,
    sectionCount >= 2,
    hasContact,
    hasEntries,
  ].filter(Boolean).length;
}

function isUsableResumeText(text: string): boolean {
  return scoreResumeTextQuality(text) >= 4;
}

function extractDates(line: string): { startDate: string; endDate: string } {
  const datePattern =
    /((?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\.?\s+)?((?:19|20)\d{2})|present|current/gi;
  const matches = [...line.matchAll(datePattern)].map((match) =>
    normalizeLine(match[0]),
  );
  return {
    startDate: matches[0] ?? '',
    endDate: matches[1] ?? (matches[0]?.toLowerCase() === 'present' ? '' : ''),
  };
}

function looksLikeEntryStart(line: string): boolean {
  return (
    Boolean(extractDates(line).startDate) ||
    splitDelimitedLine(line).length >= 2
  );
}

function parseExperience(lines: string[]): ExperienceEntry[] {
  return splitEntries(lines)
    .map((entry) => {
      const [headline = '', subhead = ''] = entry;
      const parts = splitDelimitedLine(stripDates(headline));
      const dates = extractDates(entry.join(' '));
      const bullets = entry
        .slice(1)
        .map(cleanBullet)
        .filter((line) => line && !isLikelySectionHeading(line))
        .slice(0, 6);

      return {
        id: createId(),
        role: parts[0] ?? stripDates(headline),
        company: parts[1] ?? stripDates(subhead),
        location: parts[2] ?? '',
        startDate: dates.startDate,
        endDate: dates.endDate,
        bullets: bullets.length > 0 ? bullets : [''],
      };
    })
    .filter((entry) => entry.role || entry.company || entry.bullets[0]);
}

function parseEducation(lines: string[]): EducationEntry[] {
  return splitEntries(lines)
    .map((entry) => {
      const [first = '', second = ''] = entry;
      const headlineParts = splitDelimitedLine(stripDates(first));
      const dates = extractDates(entry.join(' '));

      return {
        id: createId(),
        school: headlineParts[1] ?? stripDates(first),
        degree: headlineParts[0] ?? stripDates(second),
        startDate: dates.startDate,
        endDate: dates.endDate,
        notes: [...headlineParts.slice(2), ...entry.slice(1).map(cleanBullet)]
          .filter(Boolean)
          .join('\n'),
      };
    })
    .filter((entry) => entry.school || entry.degree);
}

function parseSkills(lines: string[]): SkillCategory[] {
  const expandedLines = lines.flatMap((line) => {
    if (!line.includes(':') && line.includes(' · ')) {
      return splitDelimitedLine(line).map((part) => `Languages: ${part}`);
    }
    return line;
  });
  const mergedLines = expandedLines.reduce<string[]>((result, line) => {
    if (line.includes(':') || result.length === 0) {
      result.push(line);
      return result;
    }

    result[result.length - 1] = `${result[result.length - 1]} · ${line}`;
    return result;
  }, []);
  const joined = mergedLines.join('\n');
  const grouped = mergedLines
    .filter((line) => line.includes(':'))
    .map((line) => {
      const [name, ...skills] = line.split(':');
      return {
        id: createId(),
        name: normalizeLine(name),
        skills: normalizeLine(skills.join(':')),
      };
    })
    .filter((entry) => entry.name && entry.skills);

  if (grouped.length > 0) return grouped;

  const skills = joined
    .split(/[,•|]/)
    .map(normalizeLine)
    .filter(Boolean)
    .join(', ');

  return skills ? [{ id: createId(), name: 'Skills', skills }] : [];
}

function parseProjects(lines: string[]): ProjectEntry[] {
  return splitEntries(lines)
    .map((entry) => {
      const [headline = '', ...bullets] = entry;
      const parts = splitDelimitedLine(stripDates(headline));
      return {
        id: createId(),
        name: parts[0] ?? headline.replace(/[:|].*$/, '').trim(),
        link: extractUrl(entry.join(' ')),
        bullets: [
          ...parts.slice(1),
          ...bullets
            .map(cleanBullet)
            .filter((line) => !/^tech stack:/i.test(line)),
        ]
          .filter(Boolean)
          .slice(0, 5),
      };
    })
    .filter((entry) => entry.name);
}

function parseCertifications(lines: string[]): CertificationEntry[] {
  return lines
    .map((line) => {
      const parts = splitDelimitedLine(stripDates(line));
      const dates = extractDates(line);
      return {
        id: createId(),
        name: parts[0]?.replace(/\b(19|20)\d{2}\b.*$/, '').trim() ?? '',
        issuer: parts[1] ?? '',
        date: dates.startDate,
      };
    })
    .filter((entry) => entry.name);
}

async function extractDigitalResumePdfText(
  pdfDocument: pdfjsLib.PDFDocumentProxy,
) {
  const pages: string[] = [];

  for (
    let pageNumber = 1;
    pageNumber <= pdfDocument.numPages;
    pageNumber += 1
  ) {
    const page = await pdfDocument.getPage(pageNumber);
    const content = await page.getTextContent();
    pages.push(
      groupTextItemsByRows(
        content.items
          .filter((item) => 'str' in item)
          .map((item) => ({
            str: item.str,
            transform: 'transform' in item ? item.transform : undefined,
          })),
      ),
    );
  }

  return pages.join('\n');
}

async function extractOcrResumePdfText(
  pdfDocument: pdfjsLib.PDFDocumentProxy,
  onStatus?: (status: string) => void,
): Promise<string> {
  const { createWorker } = await import('tesseract.js');
  const worker = await createWorker('eng');
  const pages: string[] = [];

  try {
    for (
      let pageNumber = 1;
      pageNumber <= pdfDocument.numPages;
      pageNumber += 1
    ) {
      onStatus?.(
        `Running OCR on page ${pageNumber} of ${pdfDocument.numPages}...`,
      );
      const page = await pdfDocument.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 2 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      if (!context) {
        throw new Error('Unable to prepare this PDF page for OCR.');
      }

      canvas.width = viewport.width;
      canvas.height = viewport.height;
      await page.render({ canvasContext: context, viewport }).promise;

      const result = await worker.recognize(canvas);
      pages.push(result.data.text);
    }
  } finally {
    await worker.terminate();
  }

  return pages.join('\n');
}

export async function extractResumePdfText(
  file: File,
  options: ResumePdfImportOptions = {},
): Promise<string> {
  const buffer = await file.arrayBuffer();
  const pdfDocument = await pdfjsLib.getDocument({ data: buffer }).promise;
  const shouldUseOcr = options.preferOcr ?? false;

  if (shouldUseOcr) {
    try {
      const ocrText = await extractOcrResumePdfText(
        pdfDocument,
        options.onStatus,
      );
      if (ocrText.trim().length >= 40) return ocrText;
    } catch (error) {
      console.warn('OCR failed, falling back to embedded PDF text.', error);
    }
  }

  options.onStatus?.('Reading embedded PDF text...');
  const digitalText = await extractDigitalResumePdfText(pdfDocument);
  if (isUsableResumeText(digitalText) || shouldUseOcr) return digitalText;

  try {
    options.onStatus?.('Embedded text was incomplete. Running OCR...');
    const ocrText = await extractOcrResumePdfText(
      pdfDocument,
      options.onStatus,
    );
    if (ocrText.trim().length >= 40) return ocrText;
  } catch (error) {
    console.warn('OCR failed after embedded PDF text was incomplete.', error);
  }

  return digitalText;
}

export function parseResumeText(
  text: string,
  currentData: ResumeData,
): ResumeData {
  const fallback = createDefaultResume();
  const lines = text.split(/\r?\n/).map(normalizeLine).filter(Boolean);
  const sections = splitIntoSections(lines);
  inferSummaryFromHeader(sections);
  const header = sections.header ?? lines.slice(0, 8);
  const fullText = lines.join(' ');
  const email = extractEmail(fullText);
  const phone = extractPhone(fullText);
  const name = extractName(header, email, phone);

  const languageSkills = parseSkills(sections.languages ?? []);
  const skills = [...parseSkills(sections.skills ?? []), ...languageSkills];
  const experience = parseExperience(sections.experience ?? []);
  const education = parseEducation(sections.education ?? []);
  const projects = parseProjects(sections.projects ?? []);
  const certifications = parseCertifications(sections.certifications ?? []);
  const summary = (sections.summary ?? []).join(' ');

  return {
    personalInfo: {
      name,
      title: extractTitle(header, name),
      email,
      phone,
      location: '',
      website: extractUrl(fullText),
      linkedin: extractUrl(fullText, 'linkedin'),
      github: extractUrl(fullText, 'github'),
    },
    summary,
    skills: skills.length > 0 ? skills : fallback.skills,
    experience: experience.length > 0 ? experience : [],
    education: education.length > 0 ? education : [],
    projects,
    certifications,
    layout: currentData.layout,
    visibility: {
      ...currentData.visibility,
      summary: Boolean(summary),
      projects: projects.length > 0,
      certifications: certifications.length > 0,
    },
  };
}
