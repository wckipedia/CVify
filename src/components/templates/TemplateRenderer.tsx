import type { ResumeData } from '../../types/resume';
import { ATSCleanTemplate } from './ATSCleanTemplate';
import { BentoTemplate } from './BentoTemplate';
import { DesignerTemplate } from './DesignerTemplate';
import { EditorialTemplate } from './EditorialTemplate';
import { ElegantTemplate } from './ElegantTemplate';
import { ExecutiveTemplate } from './ExecutiveTemplate';
import { ModernTemplate } from './ModernTemplate';
import { SidebarProTemplate } from './SidebarProTemplate';
import { SunriseTemplate } from './SunriseTemplate';
import { TechTemplate } from './TechTemplate';
import { TimelineTemplate } from './TimelineTemplate';

interface TemplateRendererProps {
  data: ResumeData;
}

export function TemplateRenderer({ data }: TemplateRendererProps) {
  switch (data.layout.template) {
    case 'modern':
      return <ModernTemplate data={data} />;
    case 'executive':
      return <ExecutiveTemplate data={data} />;
    case 'elegant':
      return <ElegantTemplate data={data} />;
    case 'tech':
      return <TechTemplate data={data} />;
    case 'designer':
      return <DesignerTemplate data={data} />;
    case 'sunrise':
      return <SunriseTemplate data={data} />;
    case 'sidebar-pro':
      return <SidebarProTemplate data={data} />;
    case 'timeline':
      return <TimelineTemplate data={data} />;
    case 'bento':
      return <BentoTemplate data={data} />;
    case 'editorial':
      return <EditorialTemplate data={data} />;
    case 'ats-clean':
    default:
      return <ATSCleanTemplate data={data} />;
  }
}
