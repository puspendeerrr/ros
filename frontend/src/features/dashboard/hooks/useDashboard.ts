import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../../store/auth.store';
import { menuService } from '../../../services/menu.service';

export const useDashboard = () => {
  const navigate = useNavigate();
  const { restaurant } = useAuthStore();

  // Queries
  const { data: categoriesData, isLoading: loadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => menuService.getCategories(),
  });

  const { data: itemsData, isLoading: loadingItems } = useQuery({
    queryKey: ['items'],
    queryFn: () => menuService.getItems(),
  });

  const categories = categoriesData?.data || [];
  const items = itemsData?.data || [];

  // Calculations
  const totalCategories = categories.length;
  const totalItems = items.length;
  const availableItems = items.filter((i) => i.isAvailable).length;
  const unavailableItems = items.filter((i) => !i.isAvailable).length;

  // Menu completion percentage calculation
  let completionProgress = 0;
  if (totalCategories > 0) completionProgress += 30;
  if (totalItems > 0) completionProgress += 40;
  if (totalItems >= 3) completionProgress += 30;

  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return {
    restaurant,
    categories,
    items,
    loadingCategories,
    loadingItems,
    totalCategories,
    totalItems,
    availableItems,
    unavailableItems,
    completionProgress,
    todayStr,
    navigate,
  };
};
