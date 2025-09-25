import { useState } from 'react';
import { State } from 'react-native-gesture-handler';
import { 
  Grid, 
  LevelData, 
  StartDot, 
  PathCollection, 
  Dot 
} from '../types/game';
import { GRID_SIZE, CELL_SIZE, LEVELS } from '../constants/game';

export function useGameLogic() {
  // Level states
  const [currentLevel, setCurrentLevel] = useState<string>("level1");
  const [levelData, setLevelData] = useState<LevelData>(LEVELS[currentLevel]);
  const [isLevelComplete, setIsLevelComplete] = useState<boolean>(false);

  // Grid generator
  const generateGridFromLevel = (levelData: LevelData): Grid => {
    const grid: Grid = Array(GRID_SIZE)
      .fill(null)
      .map(() => Array(GRID_SIZE).fill(0));

    levelData.dots.forEach((dot: Dot) => {
      const [startRow, startCol] = dot.start;
      const [endRow, endCol] = dot.end;

      grid[startRow][startCol] = dot.color;
      grid[endRow][endCol] = dot.color;
    });

    return grid;
  };

  const [grid, setGrid] = useState<Grid>(() =>
    generateGridFromLevel(levelData)
  );

  // Touch states
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [currentPath, setCurrentPath] = useState<[number, number][]>([]);
  const [startDot, setStartDot] = useState<StartDot | null>(null);
  const [completedPaths, setCompletedPaths] = useState<PathCollection>({});
  const [incompletePaths, setIncompletePaths] = useState<PathCollection>({});

  // Path validation helpers
  const isAdjacentCell = (from: [number, number], to: [number, number]): boolean => {
    const [fromRow, fromCol] = from;
    const [toRow, toCol] = to;
    
    // Sadece komşu hücreler: yukarı/aşağı/sağa/sola (çapraz değil)
    const rowDiff = Math.abs(toRow - fromRow);
    const colDiff = Math.abs(toCol - fromCol);
    
    // Tam komşu hücre: bir yönde 1 fark, diğer yönde 0 fark
    return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
  };

  const isValidMove = (newRow: number, newCol: number): boolean => {
    if (!startDot || currentPath.length === 0) return false;
    
    const lastPosition = currentPath[currentPath.length - 1];
    
    // 1. Komşu hücre kontrolü
    if (!isAdjacentCell(lastPosition, [newRow, newCol])) {
      console.log(`❌ Invalid move: not adjacent. Last: ${lastPosition}, New: [${newRow}, ${newCol}]`);
      return false;
    }
    
    // 2. Hücre içerik kontrolü
    const cellValue = grid[newRow][newCol];
    
    // 3. Completed path'lerle çakışma kontrolü
    const isInCompletedPath = Object.entries(completedPaths).some(([color, path]) => {
      if (color === startDot.color) return false;
      return path.some(([r, c]) => r === newRow && c === newCol);
    });
    
    if (isInCompletedPath) {
      console.log(`❌ Invalid move: conflicts with completed path at ${newRow},${newCol}`);
      return false;
    }
    
    // 4. Diğer incomplete path'lerle çakışma kontrolü
    const isInOtherIncompletePath = Object.entries(incompletePaths).some(([color, path]) => {
      if (color === startDot.color) return false;
      return path.some(([r, c]) => r === newRow && c === newCol);
    });
    
    if (isInOtherIncompletePath) {
      console.log(`❌ Invalid move: conflicts with other incomplete path at ${newRow},${newCol}`);
      return false;
    }
    
    // 5. Hedef hücre kontrolü
    if (cellValue !== 0) {
      // Renkli hücre - sadece aynı renk nokta olabilir (başlangıç veya bitiş)
      if (cellValue === startDot.color) {
        // Aynı rengin başlangıç veya bitiş noktası mı kontrol et
        const targetDot = levelData.dots.find(dot => dot.color === startDot.color);
        if (targetDot) {
          const [startRowTarget, startColTarget] = targetDot.start;
          const [endRow, endCol] = targetDot.end;
          
          // Başlangıç noktası veya bitiş noktası olabilir
          const isStartDot = startRowTarget === newRow && startColTarget === newCol;
          const isEndDot = endRow === newRow && endCol === newCol;
          
          if (isStartDot || isEndDot) {
            console.log(`✅ Valid move: reached ${isEndDot ? 'end' : 'start'} dot`);
            return true;
          }
        }
      }
      console.log(`❌ Invalid move: wrong colored cell at ${newRow},${newCol}`);
      return false;
    }
    
    console.log(`✅ Valid move to empty cell: ${newRow},${newCol}`);
    return true;
  };

  // Path completion check
  const checkPathCompletion = (path: [number, number][], color: string): boolean => {
    if (path.length < 2) return false;
    
    const targetDot = levelData.dots.find(dot => dot.color === color);
    if (!targetDot) return false;
    
    const [startRow, startCol] = targetDot.start;
    const [endRow, endCol] = targetDot.end;
    const firstPosition = path[0];
    const lastPosition = path[path.length - 1];
    
    // Path başlangıç ve bitiş noktalarını kontrol et
    const startsAtStart = firstPosition[0] === startRow && firstPosition[1] === startCol;
    const endsAtEnd = lastPosition[0] === endRow && lastPosition[1] === endCol;
    const startsAtEnd = firstPosition[0] === endRow && firstPosition[1] === endCol;
    const endsAtStart = lastPosition[0] === startRow && lastPosition[1] === startCol;
    
    // Path iki uç noktayı birbirine bağlıyor mu?
    const isComplete = (startsAtStart && endsAtEnd) || (startsAtEnd && endsAtStart);
    
    console.log(`🔍 Path completion check for ${color}:`, {
      pathLength: path.length,
      firstPosition,
      lastPosition,
      targetStart: [startRow, startCol],
      targetEnd: [endRow, endCol],
      isComplete
    });
    
    return isComplete;
  };

  // Complete connection
  const completeConnection = (path: [number, number][], color: string) => {
    console.log(`✅ Completing connection for color: ${color}`);
    console.log('Path:', path);
    
    // Completed paths'e ekle
    setCompletedPaths(prev => ({
      ...prev,
      [color]: [...path]
    }));
    
    // Incomplete paths'ten kaldır (varsa)
    setIncompletePaths(prev => {
      const newIncompletePaths = { ...prev };
      delete newIncompletePaths[color];
      return newIncompletePaths;
    });
    
    // Level completion check
    const totalDots = levelData.dots.length;
    const completedCount = Object.keys(completedPaths).length + 1; // +1 for current completion
    
    console.log(`🎯 Level progress: ${completedCount}/${totalDots} connections completed`);
    
    if (completedCount === totalDots) {
      setIsLevelComplete(true);
      console.log(`🎉 Level ${currentLevel} completed!`);
    }
  };

  // Reset level
  const resetLevel = () => {
    setCompletedPaths({});
    setIncompletePaths({});
    setCurrentPath([]);
    setIsDragging(false);
    setStartDot(null);
    setIsLevelComplete(false);
    setGrid(generateGridFromLevel(levelData));
    console.log('🔄 Level reset');
  };

  // Undo last connection
  const undoLastConnection = () => {
    const completedColors = Object.keys(completedPaths);
    const incompleteColors = Object.keys(incompletePaths);
    
    // Önce incomplete path'ları undo et
    if (incompleteColors.length > 0) {
      const lastIncompleteColor = incompleteColors[incompleteColors.length - 1];
      const newIncompletePaths = { ...incompletePaths };
      delete newIncompletePaths[lastIncompleteColor];
      setIncompletePaths(newIncompletePaths);
      console.log(`↩️ Undid incomplete connection: ${lastIncompleteColor}`);
    } 
    // Sonra completed path'ları undo et
    else if (completedColors.length > 0) {
      const lastCompletedColor = completedColors[completedColors.length - 1];
      const newCompletedPaths = { ...completedPaths };
      delete newCompletedPaths[lastCompletedColor];
      setCompletedPaths(newCompletedPaths);
      console.log(`↩️ Undid completed connection: ${lastCompletedColor}`);
    }
    
    // Current path'i de temizle
    setCurrentPath([]);
    setIsDragging(false);
    setStartDot(null);
    
    // Level complete durumunu resetle
    setIsLevelComplete(false);
  };

  // Next level
  const nextLevel = () => {
    const levelNumbers = Object.keys(LEVELS).sort();
    const currentIndex = levelNumbers.indexOf(currentLevel);
    
    if (currentIndex < levelNumbers.length - 1) {
      const nextLevelName = levelNumbers[currentIndex + 1];
      setCurrentLevel(nextLevelName);
      setLevelData(LEVELS[nextLevelName]);
      
      // State'leri resetle
      setCompletedPaths({});
      setIncompletePaths({});
      setCurrentPath([]);
      setIsDragging(false);
      setStartDot(null);
      setIsLevelComplete(false);
      setGrid(generateGridFromLevel(LEVELS[nextLevelName]));
      
      console.log(`🆙 Advanced to ${nextLevelName}`);
    } else {
      console.log('🎊 All levels completed!');
    }
  };

  // Pan coordinates helper
  const getGridCoordinatesFromPan = (x: number, y: number): [number, number] | null => {
    const BOARD_PADDING = 10;
    
    // Pan koordinatlarını grid koordinatlarına çevir
    const adjustedX = x - BOARD_PADDING;
    const adjustedY = y - BOARD_PADDING;
    
    const col = Math.floor(adjustedX / (CELL_SIZE + 2));
    const row = Math.floor(adjustedY / (CELL_SIZE + 2));
    
    // Grid sınırları kontrolü
    if (row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE) {
      return [row, col];
    }
    
    return null;
  };

  // Pan gesture handling
  const onPanGestureEvent = (event: any) => {
    if (!isDragging || !startDot) return;

    const { x, y } = event.nativeEvent;
    const coordinates = getGridCoordinatesFromPan(x, y);
    
    if (coordinates) {
      const [row, col] = coordinates;
      
      // Backtracking kontrolü
      const targetIndex = currentPath.findIndex(([r, c]) => r === row && c === col);
      
      if (targetIndex >= 0 && targetIndex < currentPath.length - 1) {
        // Geriye doğru gidiyoruz - path'i kısalt
        const newPath = currentPath.slice(0, targetIndex + 1);
        setCurrentPath(newPath);
        console.log(`↩️ Backtracking to: ${row},${col}`);
        return;
      }
      
      // Valid move kontrolü
      if (isValidMove(row, col)) {
        const lastPosition = currentPath[currentPath.length - 1];
        
        // Aynı hücreye tekrar dokunma kontrolü
        if (lastPosition[0] === row && lastPosition[1] === col) {
          return;
        }
        
        // Daha önce ziyaret edilmiş hücre kontrolü
        const isAlreadyInPath = currentPath.some(([r, c]) => r === row && c === col);
        
        if (!isAlreadyInPath) {
          // Yeni hücre ekle
          const newPath: [number, number][] = [...currentPath, [row, col] as [number, number]];
          setCurrentPath(newPath);
          console.log(`➕ Added to path: ${row},${col}`);
          
          // Auto-completion kontrolü
          if (checkPathCompletion(newPath, startDot.color)) {
            console.log(`🎯 Path completed! Auto-ending drag.`);
            completeConnection(newPath, startDot.color);
            setIsDragging(false);
            setStartDot(null);
            setCurrentPath([]);
            return;
          }
        } else {
          console.log(`🚫 Invalid move blocked: ${row},${col}`);
        }
      }
    }
  };

  const onPanHandlerStateChange = (event: any) => {
    const { state, x, y } = event.nativeEvent;
    
    if (state === State.BEGAN) {
      const coordinates = getGridCoordinatesFromPan(x, y);
      if (!coordinates) return;
      
      const [row, col] = coordinates;
      const cellValue = grid[row][col];
      
      // Sadece renkli nokta üzerinde başlat VEYA incomplete path üzerinde devam et
      if (cellValue !== 0) {
        const color = cellValue as string;
        
        // Bu renk zaten tamamlanmış mı kontrol et
        if (completedPaths[color]) {
          console.log(`❌ Cannot start drag: ${color} connection already completed`);
          return;
        }
        
        setIsDragging(true);
        setStartDot({ row, col, color });
        
        // Eğer bu rengin incomplete path'i varsa oradan devam et
        const existingIncompletePath = incompletePaths[color];
        if (existingIncompletePath) {
          // Incomplete path'in başından mı yoksa sonundan mı başlıyoruz?
          const pathStart = existingIncompletePath[0];
          const pathEnd = existingIncompletePath[existingIncompletePath.length - 1];
          
          if (pathStart[0] === row && pathStart[1] === col) {
            // Başından devam ediyoruz - path'i ters çevir
            setCurrentPath([...existingIncompletePath.reverse()]);
            console.log(`🔄 Continuing from START of incomplete path`);
          } else if (pathEnd[0] === row && pathEnd[1] === col) {
            // Sonundan devam ediyoruz - path'i olduğu gibi al
            setCurrentPath([...existingIncompletePath]);
            console.log(`➡️ Continuing from END of incomplete path`);
          } else {
            // Yeni path başlat
            setCurrentPath([[row, col]]);
            console.log(`🆕 Starting new path`);
          }
          
          // Incomplete path'i temizle
          const newIncompletePaths = { ...incompletePaths };
          delete newIncompletePaths[color];
          setIncompletePaths(newIncompletePaths);
        } else {
          // Yeni path başlat
          setCurrentPath([[row, col]]);
          console.log(`🆕 Starting fresh path`);
        }
        
        console.log(`🚀 Pan drag started: ${row},${col} color: ${cellValue}`);
      } else {
        // Boş hücreye dokunuldu - incomplete path'in ucunda mı kontrol et
        const incompletePath = Object.entries(incompletePaths).find(([color, path]) => {
          const pathEnd = path[path.length - 1];
          return pathEnd[0] === row && pathEnd[1] === col;
        });
        
        if (incompletePath) {
          const [color, path] = incompletePath;
          
          // Bu renk zaten tamamlanmış mı kontrol et
          if (completedPaths[color]) {
            console.log(`❌ Cannot continue: ${color} connection already completed`);
            return;
          }
          
          setIsDragging(true);
          setStartDot({ row: path[0][0], col: path[0][1], color });
          setCurrentPath([...path]);
          
          // Incomplete path'i temizle
          const newIncompletePaths = { ...incompletePaths };
          delete newIncompletePaths[color];
          setIncompletePaths(newIncompletePaths);
          
          console.log(`🔗 Continuing incomplete path from empty cell: ${row},${col} for color: ${color}`);
        }
      }
    } else if (state === State.END || state === State.CANCELLED) {
      if (isDragging && startDot && currentPath.length > 1) {
        console.log(`🏁 Pan drag ended, path length: ${currentPath.length}`);
        console.log('Final path:', currentPath);
        
        // Path completion kontrolü
        if (checkPathCompletion(currentPath, startDot.color)) {
          completeConnection(currentPath, startDot.color);
          setCurrentPath([]);
        } else {
          // Yarım kalan path'i sakla
          setIncompletePaths(prev => ({
            ...prev,
            [startDot.color]: [...currentPath]
          }));
          console.log(`💾 Saved incomplete path for color: ${startDot.color}`);
          setCurrentPath([]);
        }
      } else if (isDragging && currentPath.length <= 1) {
        // Tek nokta seçildiyse currentPath'i korumuyoruz
        setCurrentPath([]);
      }
      setIsDragging(false);
      setStartDot(null);
    }
  };

  return {
    // States
    currentLevel,
    levelData,
    isLevelComplete,
    grid,
    isDragging,
    currentPath,
    startDot,
    completedPaths,
    incompletePaths,
    
    // State setters (for direct manipulation if needed)
    setCurrentPath,
    setIsDragging,
    setStartDot,
    setCompletedPaths,
    setIncompletePaths,
    
    // Helper functions
    generateGridFromLevel,
    isAdjacentCell,
    isValidMove,
    checkPathCompletion,
    getGridCoordinatesFromPan,
    
    // Action functions
    completeConnection,
    resetLevel,
    undoLastConnection,
    nextLevel,
    
    // Event handlers
    onPanGestureEvent,
    onPanHandlerStateChange,
  };
}