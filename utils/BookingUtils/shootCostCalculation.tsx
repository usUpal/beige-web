export const shootCostCalculation = (shoot_duration: any, content_type: any, cp_ids: any, content_vertical: any) => {
  let shootDuration = parseInt(shoot_duration, 10);

  // If content type is photo and video booth, then per hour rate will be 375
  let hourlyRate = content_type?.length === 2 ? 375 : 250;

  // Calculate shoot duration cost
  let shootDurationCost;
  if (cp_ids?.length === 0) {
    shootDurationCost = shootDuration * hourlyRate * 1;
  } else {
    shootDurationCost = shootDuration * hourlyRate * cp_ids?.length;
  }
  let total = shootDurationCost;

  // Add wedding shoot cost only if content_vertical is 'Wedding' or 'Business'
  if (['Wedding', 'Commercial', 'Corporate'].includes(content_vertical)) {
    const weddingOrBusinessShootCost = 1000;
    const preProductionCost = 500;
    const postProductionCost = 500;
    total = shootDurationCost + weddingOrBusinessShootCost + preProductionCost + postProductionCost;
  }
  return total;
};
