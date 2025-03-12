import { FilterSelection } from '../types/FilterType';

export function getFiltersFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const filters: FilterSelection = {};

  const startDate = urlParams.get('startDate');

  if (startDate) {
    const parsedStartDate = new Date(startDate);

    if (!isNaN(parsedStartDate.getTime())) {
      filters.startDate = parsedStartDate;
    }
  }

  const endDate = urlParams.get('endDate');

  if (endDate) {
    const parsedEndDate = new Date(endDate);

    if (!isNaN(parsedEndDate.getTime())) {
      filters.startDate = parsedEndDate;
    }
  }

  const categoryId = urlParams.get('categoryId');

  if (categoryId) {
    filters.categoryId = categoryId;
  }

  const opportunityType = urlParams.get('opportunityType');

  if (opportunityType) {
    filters.opportunityType = opportunityType;
  }

  const assistanceType = urlParams.get('assistanceType');

  if (assistanceType) {
    filters.assistanceType = assistanceType;
  }

  const region = urlParams.get('region');

  if (region) {
    filters.region = region;
  }

  const timeDemands = urlParams.get('timeDemands');

  if (timeDemands) {
    filters.timeDemands = timeDemands;
  }

  const query = urlParams.get('query');

  if (query) {
    filters.query = query;
  }

  return filters;
}
