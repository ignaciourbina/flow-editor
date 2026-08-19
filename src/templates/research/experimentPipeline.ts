/**
 * @module templates/research/experimentPipeline
 * @description Pre-built template: research experiment pipeline with decision loop.
 * Flow: Start → Hypothesis → Experiment Design → Data Collection → Analysis
 *       → Decision (Significant?) → [Yes → Publish] / [No → Revise Hypothesis] → End
 *
 * @owner Team Epsilon (Templates & Domains)
 * @dependencies types/project, lib/factories
 */

import type { FlowProject } from '@/types/project';
import { createNode } from '@/lib/factories/nodeFactory';
import { createEdge } from '@/lib/factories/edgeFactory';
import { createProject } from '@/lib/factories/projectFactory';

/**
 * Creates a research experiment pipeline project template.
 *
 * @returns A fully populated FlowProject for experiment workflows.
 */
export function experimentPipelineTemplate(): FlowProject {
  const project = createProject('Experiment Pipeline', 'research');

  const start = createNode('start', { x: 250, y: 0 }, { label: 'Start', variant: 'start' });
  const hypothesis = createNode('hypothesis', { x: 250, y: 120 }, { label: 'Hypothesis' });
  const design = createNode('experiment', { x: 250, y: 240 }, { label: 'Experiment Design' });
  const collect = createNode('process', { x: 250, y: 360 }, { label: 'Data Collection' });
  const analysis = createNode('analysis', { x: 250, y: 480 }, { label: 'Analysis' });
  const decision = createNode('decision', { x: 250, y: 620 }, {
    label: 'Significant?',
    branches: { yes: 'Yes', no: 'No' },
  });
  const publish = createNode('document', { x: 80, y: 760 }, { label: 'Publish' });
  const revise = createNode('process', { x: 420, y: 760 }, { label: 'Revise Hypothesis' });
  const end = createNode('end', { x: 80, y: 900 }, { label: 'End', variant: 'end' });

  const nodes = [start, hypothesis, design, collect, analysis, decision, publish, revise, end];

  const edges = [
    createEdge(start.id, hypothesis.id),
    createEdge(hypothesis.id, design.id),
    createEdge(design.id, collect.id),
    createEdge(collect.id, analysis.id),
    createEdge(analysis.id, decision.id),
    createEdge(decision.id, publish.id, 'conditional', { label: 'Yes', condition: 'yes' }),
    createEdge(decision.id, revise.id, 'conditional', { label: 'No', condition: 'no' }),
    createEdge(publish.id, end.id),
    createEdge(revise.id, hypothesis.id, 'default', { label: 'Retry' }),
  ];

  project.flow = { nodes, edges, viewport: { x: 0, y: 0, zoom: 1 } };
  return project;
}
