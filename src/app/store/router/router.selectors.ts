import { createFeatureSelector } from '@ngrx/store';
import { RouterReducerState, getRouterSelectors } from '@ngrx/router-store';

// Якщо у вас немає окремого RouterState, використовуємо стандартний any або вашу структуру
export const selectRouterState = createFeatureSelector<RouterReducerState<any>>('router');

export const {
    selectCurrentRoute,
    selectFragment,
    selectQueryParams,
    selectQueryParam,
    selectRouteParams,
    selectRouteParam,
    selectRouteData,
    selectUrl,
    selectTitle,
} = getRouterSelectors(selectRouterState); // ВИПРАВЛЕНО НАЗВУ