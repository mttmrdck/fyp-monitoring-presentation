import type { ComponentType } from 'react'
import type { SlideProps } from '../components/Slide'
import { S1Title, S2Intro } from './Intro'
import { S3Problem, S4Objectives } from './Problem'
import { S5Literature } from './Literature'
import { S6Concept } from './Concept'
import { S7Remediation } from './Remediation'
import { S7Stakeholders, S8Summary } from './Closing'
import { sources } from '../content/sources'
import { pathNodes } from '../content/content'

export type SlideDef = {
  id: string
  title: string
  criterion: string
  /** In-slide steps revealed with Next before moving on (website only). */
  steps?: number
  Component: ComponentType<SlideProps>
}

export const slides: SlideDef[] = [
  { id: 'title', title: 'Project title', criterion: 'Project title', Component: S1Title },
  { id: 'intro', title: 'Introduction', criterion: 'Introduction', steps: 2, Component: S2Intro },
  { id: 'problem', title: 'Problem statement', criterion: 'Problem statement', steps: 4, Component: S3Problem },
  { id: 'objectives', title: 'Objectives', criterion: 'Objectives', steps: 3, Component: S4Objectives },
  { id: 'literature', title: 'Literature review', criterion: 'Literature review', steps: sources.length - 1, Component: S5Literature },
  { id: 'concept', title: 'Proposed concept', criterion: 'Introduction · Literature', steps: pathNodes.length, Component: S6Concept },
  { id: 'remediation', title: 'AI-assisted remediation', criterion: 'Proposed concept · O3', steps: 3, Component: S7Remediation },
  { id: 'stakeholders', title: 'Stakeholder collaboration', criterion: 'Stakeholder collaboration', Component: S7Stakeholders },
  { id: 'summary', title: 'Summary & questions', criterion: 'All six', Component: S8Summary },
]
