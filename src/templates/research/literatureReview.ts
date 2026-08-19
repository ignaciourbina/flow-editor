/**
 * @module templates/research/literatureReview
 * @description Pre-built template: systematic literature review process.
 * Flow: Start → Define Scope → Search → Screen → Extract Data → Synthesize
 *       → Write Review → End
 *
 * @owner Team Epsilon (Templates & Domains)
 * @dependencies types/project, lib/factories
 */

import type { FlowProject } from '@/types/project';
import { createNode } from '@/lib/factories/nodeFactory';
import { createEdge } from '@/lib/factories/edgeFactory';
import { createProject } from '@/lib/factories/projectFactory';

/**
 * Creates a literature review process project template.
 *
 * @returns A fully populated FlowProject for literature reviews.
 */
export function literatureReviewTemplate(): FlowProject {
  const project = createProject('Literature Review', 'research');

  const start = createNode('start', { x: 250, y: 0 }, { label: 'Start', variant: 'start' });
  const scope = createNode('process', { x: 250, y: 120 }, { label: 'Define Scope' });
  const search = createNode('process', { x: 250, y: 240 }, { label: 'Search' });
  const screen = createNode('process', { x: 250, y: 360 }, { label: 'Screen' });
  const extract = createNode('analysis', { x: 250, y: 480 }, { label: 'Extract Data' });
  const synthesize = createNode('analysis', { x: 250, y: 600 }, { label: 'Synthesize' });
  const write = createNode('document', { x: 250, y: 720 }, { label: 'Write Review' });
  const end = createNode('end', { x: 250, y: 840 }, { label: 'End', variant: 'end' });

  const nodes = [start, scope, search, screen, extract, synthesize, write, end];

  const edges = [
    createEdge(start.id, scope.id),
    createEdge(scope.id, search.id),
    createEdge(search.id, screen.id),
    createEdge(screen.id, extract.id),
    createEdge(extract.id, synthesize.id),
    createEdge(synthesize.id, write.id),
    createEdge(write.id, end.id),
  ];

  project.flow = { nodes, edges, viewport: { x: 0, y: 0, zoom: 1 } };
  return project;
}
