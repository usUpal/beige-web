export const shootCostCalculation = (shoot_duration: any, content_type: any, cp_ids: any, content_vertical: any, pricingData: any) => {
  const shootDuration = parseInt(shoot_duration, 10);

  const tag = content_type?.length === 2 ? 'photo&video' : content_type[0] === 'photo' ? 'Photo' : 'Video';
  const hourlyRate = pricingData.find((data) => data.tag === tag)?.rate || 0;

  const shootDurationCost = shootDuration * hourlyRate * (cp_ids?.length || 1);

  const additionalCosts = {
    Wedding: 'weddingOrCorporation',
    Commercial: 'weddingOrCorporation',
    Corporate: 'weddingOrCorporation',
    Music: 'musicVideos',
    Birthday: 'birthdayParties',
    Concert: 'concerts',
    Memorial: 'memorial',
    Other: 'other',
  };

  const extraCost = pricingData.find((data) => data.tag === additionalCosts[content_vertical])?.rate || 0;

  const preProductionCost = pricingData.find((data) => data.tag === 'preproductioncost')?.rate || 0;
  const postProductionCost = pricingData.find((data) => data.tag === 'postproductioncost')?.rate || 0;
  let total = shootDurationCost + extraCost + (['Wedding', 'Commercial', 'Corporate'].includes(content_vertical) ? preProductionCost + postProductionCost : 0);
  return total;
};
