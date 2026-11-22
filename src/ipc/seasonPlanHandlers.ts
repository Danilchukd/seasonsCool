import { ipcMain } from 'electron';
import {
  createSeasonPlan,
  deleteSeasonPlan,
  getSeasonPlans,
  updateSeasonPlan,
} from '../services/seasonPlanService';
import {
  validateCreateSeasonPlanInput,
  validateSeasonPlanId,
  validateSeasonPlanQuery,
  validateUpdateSeasonPlanInput,
} from '../validators/seasonPlanValidator';

export function registerSeasonPlanHandlers(): void {
  ipcMain.handle('seasonPlans:get', async (_event, input: unknown) => {
    const { season, seasonYear } = validateSeasonPlanQuery(input);
    return getSeasonPlans(season, seasonYear);
  });

  ipcMain.handle('seasonPlans:create', async (_event, input: unknown) => {
    return createSeasonPlan(validateCreateSeasonPlanInput(input));
  });

  ipcMain.handle('seasonPlans:update', async (_event, input: unknown) => {
    return updateSeasonPlan(validateUpdateSeasonPlanInput(input));
  });

  ipcMain.handle('seasonPlans:delete', async (_event, input: unknown) => {
    return deleteSeasonPlan(validateSeasonPlanId(input));
  });
}
