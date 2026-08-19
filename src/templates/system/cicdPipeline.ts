/**
 * @module templates/system/cicdPipeline
 * @description Pre-built template: CI/CD deployment pipeline with pass/fail decision.
 * Flow: Start (Git Push) → Build → Unit Tests → Integration Tests → Decision (Pass?)
 *       → [Yes → Stage → Deploy → End] / [No → Notify → End]
 *
 * @owner Team Epsilon (Templates & Domains)
 * @dependencies types/project, lib/factories
 */

import type { FlowProject } from '@/types/project';
import { createNode } from '@/lib/factories/nodeFactory';
import { createEdge } from '@/lib/factories/edgeFactory';
import { createProject } from '@/lib/factories/projectFactory';

/**
 * Creates a CI/CD pipeline project template.
 *
 * @returns A fully populated FlowProject for CI/CD workflows.
 */
export function cicdPipelineTemplate(): FlowProject {
  const project = createProject('CI/CD Pipeline', 'system');

  const start = createNode('start', { x: 250, y: 0 }, {
    label: 'Git Push',
    variant: 'start',
  });
  const build = createNode('service', { x: 250, y: 120 }, { label: 'Build' });
  const unitTests = createNode('process', { x: 250, y: 240 }, { label: 'Unit Tests' });
  const intTests = createNode('process', { x: 250, y: 360 }, { label: 'Integration Tests' });
  const decision = createNode('decision', { x: 250, y: 500 }, {
    label: 'Pass?',
    branches: { yes: 'Yes', no: 'No' },
  });
  const stage = createNode('server', { x: 80, y: 640 }, { label: 'Stage' });
  const deploy = createNode('server', { x: 80, y: 760 }, { label: 'Deploy' });
  const notify = createNode('process', { x: 420, y: 640 }, { label: 'Notify' });
  const endSuccess = createNode('end', { x: 80, y: 880 }, { label: 'End', variant: 'end' });
  const endFail = createNode('end', { x: 420, y: 760 }, { label: 'End', variant: 'end' });

  const nodes = [
    start, build, unitTests, intTests, decision,
    stage, deploy, notify, endSuccess, endFail,
  ];

  const edges = [
    createEdge(start.id, build.id),
    createEdge(build.id, unitTests.id),
    createEdge(unitTests.id, intTests.id),
    createEdge(intTests.id, decision.id),
    createEdge(decision.id, stage.id, 'conditional', { label: 'Yes', condition: 'yes' }),
    createEdge(decision.id, notify.id, 'conditional', { label: 'No', condition: 'no' }),
    createEdge(stage.id, deploy.id),
    createEdge(deploy.id, endSuccess.id),
    createEdge(notify.id, endFail.id),
  ];

  project.flow = { nodes, edges, viewport: { x: 0, y: 0, zoom: 1 } };
  return project;
}
