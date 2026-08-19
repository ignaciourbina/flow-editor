/**
 * @module templates/index
 * @description Template registry — lists all available templates by domain.
 * Each entry maps a unique ID, display metadata, and a factory function
 * that produces a fully populated FlowProject.
 *
 * @owner Team Epsilon (Templates & Domains)
 * @dependencies types/project, templates/*
 */

import type { FlowProject, ProjectDomain } from '@/types/project';
import { approvalWorkflowTemplate } from './admin/approvalWorkflow';
import { onboardingFlowTemplate } from './admin/onboardingFlow';
import { experimentPipelineTemplate } from './research/experimentPipeline';
import { literatureReviewTemplate } from './research/literatureReview';
import { restApiFlowTemplate } from './api/restApiFlow';
import { erDiagramTemplate } from './data/erDiagram';
import { cicdPipelineTemplate } from './system/cicdPipeline';

/** Describes a single template entry in the registry. */
export interface TemplateDefinition {
  /** Unique template identifier. */
  id: string;
  /** Human-readable template name. */
  name: string;
  /** Short description of what the template models. */
  description: string;
  /** Domain category for this template. */
  domain: ProjectDomain;
  /** Factory function that produces a new FlowProject from this template. */
  factory: () => FlowProject;
}

/** All available templates, ordered by domain. */
export const templates: TemplateDefinition[] = [
  {
    id: 'admin-approval-workflow',
    name: 'Approval Workflow',
    description: 'Multi-step approval process with manager review and revision loop.',
    domain: 'admin',
    factory: approvalWorkflowTemplate,
  },
  {
    id: 'admin-onboarding-flow',
    name: 'Onboarding Flow',
    description: 'Employee onboarding process from IT setup to first week tasks.',
    domain: 'admin',
    factory: onboardingFlowTemplate,
  },
  {
    id: 'research-experiment-pipeline',
    name: 'Experiment Pipeline',
    description: 'Research experiment lifecycle from hypothesis to publication.',
    domain: 'research',
    factory: experimentPipelineTemplate,
  },
  {
    id: 'research-literature-review',
    name: 'Literature Review',
    description: 'Systematic literature review from scope definition to write-up.',
    domain: 'research',
    factory: literatureReviewTemplate,
  },
  {
    id: 'api-rest-api-flow',
    name: 'REST API Flow',
    description: 'REST API request lifecycle from client to response.',
    domain: 'api',
    factory: restApiFlowTemplate,
  },
  {
    id: 'data-er-diagram',
    name: 'ER Diagram',
    description: 'Entity-Relationship diagram with User, Post, and Comment entities.',
    domain: 'data',
    factory: erDiagramTemplate,
  },
  {
    id: 'system-cicd-pipeline',
    name: 'CI/CD Pipeline',
    description: 'Continuous integration and deployment pipeline with pass/fail branching.',
    domain: 'system',
    factory: cicdPipelineTemplate,
  },
];
