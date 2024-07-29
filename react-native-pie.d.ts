declare module 'react-native-pie' {
  import { Component } from 'react';
  import { ViewStyle } from 'react-native';

  interface Section {
    percentage: number;
    color: string;
  }

  interface PieProps {
    radius: number;
    innerRadius: number;
    sections: Section[];
    dividerSize?: number;
    strokeCap?: 'butt' | 'round' | 'square';
    backgroundColor?: string;
    style?: ViewStyle;
  }

  export default class Pie extends Component<PieProps> {}
}
