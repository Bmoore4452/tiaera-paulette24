import type { ComponentType } from 'react';
import type { ActivityKind } from '../../../data/course';
import type { ActivityProps } from './types';

// Time Mastery
import TimeAudit from './TimeAudit';
import TimeBlocking from './TimeBlocking';
import BoundarySetting from './BoundarySetting';
import DistractionMapping from './DistractionMapping';
import EnergyRhythms from './EnergyRhythms';
import Pareto from './Pareto';
import WorkLifeIntegration from './WorkLifeIntegration';
import MasteryRoadmap from './MasteryRoadmap';
// Master Me
import IdentityInventory from './IdentityInventory';
import TimeEnergyAudit from './TimeEnergyAudit';
import SabotageAssessment from './SabotageAssessment';
import HabitBuilder from './HabitBuilder';
import VisionCasting from './VisionCasting';
import BridgeFuture from './BridgeFuture';
// Fallback
import Reflection from './Reflection';

const REGISTRY: Partial<Record<ActivityKind, ComponentType<ActivityProps>>> = {
  // Time Mastery
  'time-audit': TimeAudit,
  'time-blocking': TimeBlocking,
  'boundary-setting': BoundarySetting,
  'distraction-mapping': DistractionMapping,
  'energy-rhythms': EnergyRhythms,
  pareto: Pareto,
  'work-life-integration': WorkLifeIntegration,
  'mastery-roadmap': MasteryRoadmap,
  // Master Me
  'identity-inventory': IdentityInventory,
  'time-energy-audit': TimeEnergyAudit,
  'sabotage-assessment': SabotageAssessment,
  'habit-builder': HabitBuilder,
  'vision-casting': VisionCasting,
  'bridge-future': BridgeFuture,
};

/** Resolve an activity kind to its component, falling back to the generic reflection worksheet. */
export function activityComponent(kind: ActivityKind): ComponentType<ActivityProps> {
  return REGISTRY[kind] ?? Reflection;
}
