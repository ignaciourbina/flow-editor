/**
 * @module templates/admin/onboardingFlow
 * @description Pre-built template: employee onboarding process.
 * Flow: Start → IT Setup → HR Orientation → Team Introduction → First Week Tasks → End
 *
 * @owner Team Epsilon (Templates & Domains)
 * @dependencies types/project, lib/factories
 */

import type { FlowProject } from '@/types/project';
import { createNode } from '@/lib/factories/nodeFactory';
import { createEdge } from '@/lib/factories/edgeFactory';
import { createProject } from '@/lib/factories/projectFactory';

/**
 * Creates an employee onboarding flow project template.
 *
 * @returns A fully populated FlowProject for onboarding.
 */
export function onboardingFlowTemplate(): FlowProject {
  const project = createProject('Onboarding Flow', 'admin');

  const start = createNode('start', { x: 250, y: 0 }, { label: 'Start', variant: 'start' });
  const itSetup = createNode('process', { x: 250, y: 120 }, { label: 'IT Setup' });
  const hrOrientation = createNode('process', { x: 250, y: 240 }, { label: 'HR Orientation' });
  const teamIntro = createNode('person', { x: 250, y: 360 }, { label: 'Team Introduction' });
  const firstWeek = createNode('process', { x: 250, y: 480 }, { label: 'First Week Tasks' });
  const end = createNode('end', { x: 250, y: 600 }, { label: 'End', variant: 'end' });

  const nodes = [start, itSetup, hrOrientation, teamIntro, firstWeek, end];

  const edges = [
    createEdge(start.id, itSetup.id),
    createEdge(itSetup.id, hrOrientation.id),
    createEdge(hrOrientation.id, teamIntro.id),
    createEdge(teamIntro.id, firstWeek.id),
    createEdge(firstWeek.id, end.id),
  ];

  project.flow = { nodes, edges, viewport: { x: 0, y: 0, zoom: 1 } };
  return project;
}
