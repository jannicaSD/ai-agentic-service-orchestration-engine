import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import type { ServiceCategoryFilter } from '../../types';
import { moderateScale } from '../../utils/responsive';
import { SERVICE_CATEGORY_OPTIONS, getServiceCategoryOption } from '../../utils/serviceCategories';

interface CategoryChipBarProps {
  selectedCategory: ServiceCategoryFilter;
  providerCountByCategory: Record<ServiceCategoryFilter, number>;
  onSelectCategory: (category: ServiceCategoryFilter) => void;
}

export const CategoryChipBar: React.FC<CategoryChipBarProps> = ({
  selectedCategory,
  providerCountByCategory,
  onSelectCategory,
}) => {
  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: moderateScale(4),
          gap: moderateScale(10),
          alignItems: 'center',
        }}
      >
        {SERVICE_CATEGORY_OPTIONS.map(option => {
          const isActive = option.key === selectedCategory;
          const count = providerCountByCategory[option.key] ?? 0;
          const label = option.key === 'all' ? 'All' : `${getServiceCategoryOption(option.key).label} (${count})`;

          return (
            <TouchableOpacity
              key={option.key}
              onPress={() => onSelectCategory(option.key)}
              activeOpacity={0.85}
              style={{ minHeight: 44 }}
              className={`px-4 py-2.5 rounded-full border ${
                isActive ? 'bg-primary/20 border-primary' : 'bg-card/90 border-border/50'
              }`}
            >
              <Text
                className={`text-sm font-semibold ${isActive ? 'text-primary' : 'text-textMuted'}`}
                numberOfLines={1}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View className="px-1 pt-2">
        <Text className="text-textMuted text-xs">
          Filtering is a preference only. AntiGravity can override when the text strongly indicates another category.
        </Text>
      </View>
    </View>
  );
};
