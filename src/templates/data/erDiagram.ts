/**
 * @module templates/data/erDiagram
 * @description Pre-built template: Entity-Relationship diagram with sample entities.
 * Entities: User, Post, Comment — connected with relationship edges.
 *
 * @owner Team Epsilon (Templates & Domains)
 * @dependencies types/project, lib/factories
 */

import type { FlowProject } from '@/types/project';
import { createNode } from '@/lib/factories/nodeFactory';
import { createEdge } from '@/lib/factories/edgeFactory';
import { createProject } from '@/lib/factories/projectFactory';

/**
 * Creates an Entity-Relationship diagram project template.
 *
 * @returns A fully populated FlowProject with sample entities and relationships.
 */
export function erDiagramTemplate(): FlowProject {
  const project = createProject('ER Diagram', 'data');

  const userEntity = createNode('entity', { x: 100, y: 100 }, {
    label: 'User',
    fields: [
      { name: 'id', type: 'UUID', isPrimaryKey: true },
      { name: 'name', type: 'VARCHAR(255)' },
      { name: 'email', type: 'VARCHAR(255)' },
    ],
  });

  const postEntity = createNode('entity', { x: 400, y: 100 }, {
    label: 'Post',
    fields: [
      { name: 'id', type: 'UUID', isPrimaryKey: true },
      { name: 'title', type: 'VARCHAR(255)' },
      { name: 'body', type: 'TEXT' },
      { name: 'author_id', type: 'UUID' },
    ],
  });

  const commentEntity = createNode('entity', { x: 400, y: 350 }, {
    label: 'Comment',
    fields: [
      { name: 'id', type: 'UUID', isPrimaryKey: true },
      { name: 'text', type: 'TEXT' },
      { name: 'post_id', type: 'UUID' },
      { name: 'author_id', type: 'UUID' },
    ],
  });

  const userPostRel = createNode('relationship', { x: 250, y: 50 }, {
    label: 'has many',
  });
  const postCommentRel = createNode('relationship', { x: 500, y: 225 }, {
    label: 'has many',
  });
  const userCommentRel = createNode('relationship', { x: 100, y: 350 }, {
    label: 'writes',
  });

  const nodes = [
    userEntity, postEntity, commentEntity,
    userPostRel, postCommentRel, userCommentRel,
  ];

  const edges = [
    createEdge(userEntity.id, userPostRel.id, 'data', { label: '1' }),
    createEdge(userPostRel.id, postEntity.id, 'data', { label: 'N' }),
    createEdge(postEntity.id, postCommentRel.id, 'data', { label: '1' }),
    createEdge(postCommentRel.id, commentEntity.id, 'data', { label: 'N' }),
    createEdge(userEntity.id, userCommentRel.id, 'data', { label: '1' }),
    createEdge(userCommentRel.id, commentEntity.id, 'data', { label: 'N' }),
  ];

  project.flow = { nodes, edges, viewport: { x: 0, y: 0, zoom: 1 } };
  return project;
}
