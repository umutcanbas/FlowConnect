import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { GameControlsProps } from '../../types/game';

export default function GameControls({
  onUndo,
  canUndo,
  onReset,
  isLevelComplete,
  onNextLevel,
  isLastLevel
}: GameControlsProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      {/* Main Control Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[
            styles.button, 
            styles.undoButton,
            !canUndo && styles.disabledButton
          ]} 
          onPress={onUndo}
          disabled={!canUndo}
        >
          <Text style={[
            styles.buttonText,
            !canUndo && styles.disabledButtonText
          ]}>↩️ Undo</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.resetButton]} 
          onPress={onReset}
        >
          <Text style={styles.buttonText}>🔄 Reset</Text>
        </TouchableOpacity>
      </View>

      {/* Level Complete Section */}
      {isLevelComplete && (
        <View style={styles.levelCompleteContainer}>
          <Text style={styles.levelCompleteText}>🎉 Level Complete!</Text>
          <TouchableOpacity 
            style={[styles.button, styles.nextLevelButton]} 
            onPress={onNextLevel}
            disabled={isLastLevel}
          >
            <Text style={styles.buttonText}>
              {isLastLevel ? "🏆 All Complete!" : "➡️ Next Level"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  undoButton: {
    backgroundColor: '#4a90e2',
  },
  resetButton: {
    backgroundColor: '#e74c3c',
  },
  nextLevelButton: {
    backgroundColor: '#4caf50',
  },
  disabledButton: {
    backgroundColor: '#666',
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButtonText: {
    color: '#999',
  },
  levelCompleteContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#2d5a27',
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4caf50',
  },
  levelCompleteText: {
    color: '#4caf50',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});