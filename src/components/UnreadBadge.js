import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const UnreadBadge = ({ count, style }) => {
  if (count === 0) return null;

  return (
    <View style={[styles.badge, style]}>
      <Text style={styles.text}>
        {count > 99 ? '99+' : count.toString()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default UnreadBadge;

