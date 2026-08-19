/**
 * @module templates/admin/approvalWorkflow
 * @description Pre-built template: multi-step approval workflow with decision loop.
 * Flow: Start → Submit Request → Manager Review → Decision (Approved?)
 *       → [Yes → Complete] / [No → Revise → loop to Submit] → End
 *
 * @owner Team Epsilon (Templates & Domains)
 * @dependencies types/project, lib/factories
 */

import type { FlowProject } from '@/types/project';
import { createNode } from '@/lib/factories/nodeFactory';
import { createEdge } from '@/lib/factories/edgeFactory';
import { createProject } from '@/lib/factories/projectFactory';

/**
 * Creates an approval workflow project template.
 *
 * @returns A fully populated FlowProject for an admin approval process.
 */
export function approvalWorkflowTemplate(): FlowProject {
  const project = createProject('Approval Workflow', 'admin');

  const start = createNode('start', { x: 250, y: 0 }, { label: 'Start', variant: 'start' });
  const submit = createNode('process', { x: 250, y: 120 }, { label: 'Submit Request' });
  const review = createNode('approval', { x: 250, y: 240 }, { label: 'Manager Review' });
  const decision = createNode('decision', { x: 250, y: 380 }, {
    label: 'Approved?',
    branches: { yes: 'Yes', no: 'No' },
  });
  const complete = createNode('process', { x: 80, y: 520 }, { label: 'Complete' });
  const revise = createNode('process', { x: 420, y: 520 }, { label: 'Revise' });
  const end = createNode('end', { x: 80, y: 660 }, { label: 'End', variant: 'end' });

  const nodes = [start, submit, review, decision, complete, revise, end];

  const edges = [
    createEdge(start.id, submit.id),
    createEdge(submit.id, review.id),
    createEdge(review.id, decision.id),
    createEdge(decision.id, complete.id, 'conditional', { label: 'Yes', condition: 'yes' }),
    createEdge(decision.id, revise.id, 'conditional', { label: 'No', condition: 'no' }),
    createEdge(complete.id, end.id),
    createEdge(revise.id, submit.id, 'default', { label: 'Resubmit' }),
  ];

  project.flow = { nodes, edges, viewport: { x: 0, y: 0, zoom: 1 } };
  return project;
}
