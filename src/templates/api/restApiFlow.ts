/**
 * @module templates/api/restApiFlow
 * @description Pre-built template: REST API request lifecycle.
 * Flow: Start (Client Request) → Auth Check → Route → Controller → Service
 *       → Database → Response → End
 *
 * @owner Team Epsilon (Templates & Domains)
 * @dependencies types/project, lib/factories
 */

import type { FlowProject } from '@/types/project';
import { createNode } from '@/lib/factories/nodeFactory';
import { createEdge } from '@/lib/factories/edgeFactory';
import { createProject } from '@/lib/factories/projectFactory';

/**
 * Creates a REST API request lifecycle project template.
 *
 * @returns A fully populated FlowProject for API flow modelling.
 */
export function restApiFlowTemplate(): FlowProject {
  const project = createProject('REST API Flow', 'api');

  const start = createNode('start', { x: 250, y: 0 }, {
    label: 'Client Request',
    variant: 'start',
  });
  const auth = createNode('authToken', { x: 250, y: 120 }, { label: 'Auth Check' });
  const route = createNode('apiEndpoint', { x: 250, y: 240 }, {
    label: 'Route',
    method: 'GET',
    path: '/api/resource',
  });
  const controller = createNode('process', { x: 250, y: 360 }, { label: 'Controller' });
  const service = createNode('service', { x: 250, y: 480 }, { label: 'Service' });
  const database = createNode('database', { x: 250, y: 600 }, { label: 'Database' });
  const response = createNode('requestResponse', { x: 250, y: 720 }, { label: 'Response' });
  const end = createNode('end', { x: 250, y: 840 }, { label: 'End', variant: 'end' });

  const nodes = [start, auth, route, controller, service, database, response, end];

  const edges = [
    createEdge(start.id, auth.id),
    createEdge(auth.id, route.id),
    createEdge(route.id, controller.id),
    createEdge(controller.id, service.id),
    createEdge(service.id, database.id, 'data', { label: 'Query' }),
    createEdge(database.id, response.id, 'data', { label: 'Result' }),
    createEdge(response.id, end.id),
  ];

  project.flow = { nodes, edges, viewport: { x: 0, y: 0, zoom: 1 } };
  return project;
}
