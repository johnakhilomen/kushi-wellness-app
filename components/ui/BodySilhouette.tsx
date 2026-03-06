import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import Svg, { Path, Ellipse } from 'react-native-svg';
import { colors } from '../../constants/theme';

export type BodyZone =
	| 'head'
	| 'neck'
	| 'chest'
	| 'stomach'
	| 'left_arm'
	| 'right_arm'
	| 'lower_back'
	| 'legs';

export type ZoneFeeling = 'comfortable' | 'tense' | 'sore' | 'energized' | 'numb';

export const ZONE_COLORS: Record<ZoneFeeling, string> = {
	comfortable: '#7CBA8E',
	energized: '#5DADE2',
	tense: '#F0B761',
	sore: '#E07A5F',
	numb: '#A9A9A9',
};

const ZONE_LABELS: Record<BodyZone, string> = {
	head: 'Head',
	neck: 'Neck & Shoulders',
	chest: 'Chest',
	stomach: 'Stomach & Gut',
	left_arm: 'Left Arm',
	right_arm: 'Right Arm',
	lower_back: 'Lower Back & Hips',
	legs: 'Legs & Feet',
};

export function getZoneLabel(zone: BodyZone): string {
	return ZONE_LABELS[zone];
}

interface Props {
	zones: Partial<Record<BodyZone, ZoneFeeling>>;
	onZonePress: (zone: BodyZone) => void;
	size?: number;
}

function zoneColor(zones: Props['zones'], zone: BodyZone): string {
	const feeling = zones[zone];
	return feeling ? ZONE_COLORS[feeling] : colors.stroke;
}

export function BodySilhouette({ zones, onZonePress, size = 300 }: Props) {
	const scale = size / 300;

	return (
		<View style={[styles.container, { width: size, height: size * 1.45 }]}>
			<Svg
				width={size}
				height={size * 1.45}
				viewBox="0 0 300 435"
			>
				{/* Head */}
				<Ellipse
					cx="150"
					cy="40"
					rx="30"
					ry="36"
					fill={zoneColor(zones, 'head')}
					opacity={0.85}
				/>

				{/* Neck & Shoulders */}
				<Path
					d="M135 76 L130 95 L80 110 L80 125 L130 115 L170 115 L220 125 L220 110 L170 95 L165 76"
					fill={zoneColor(zones, 'neck')}
					opacity={0.85}
				/>

				{/* Left Arm */}
				<Path
					d="M80 110 L60 160 L50 220 L55 265 L70 265 L75 220 L80 170 L95 130"
					fill={zoneColor(zones, 'left_arm')}
					opacity={0.85}
				/>

				{/* Right Arm */}
				<Path
					d="M220 110 L240 160 L250 220 L245 265 L230 265 L225 220 L220 170 L205 130"
					fill={zoneColor(zones, 'right_arm')}
					opacity={0.85}
				/>

				{/* Chest */}
				<Path
					d="M130 115 L95 130 L100 180 L130 190 L170 190 L200 180 L205 130 L170 115 Z"
					fill={zoneColor(zones, 'chest')}
					opacity={0.85}
				/>

				{/* Stomach & Gut */}
				<Path
					d="M100 180 L130 190 L170 190 L200 180 L195 240 L185 265 L115 265 L105 240 Z"
					fill={zoneColor(zones, 'stomach')}
					opacity={0.85}
				/>

				{/* Lower Back & Hips */}
				<Path
					d="M105 240 L115 265 L185 265 L195 240 L190 290 L175 300 L125 300 L110 290 Z"
					fill={zoneColor(zones, 'lower_back')}
					opacity={0.85}
				/>

				{/* Legs & Feet */}
				<Path
					d="M125 300 L175 300 L175 310 L165 370 L170 420 L155 430 L150 420 L150 310 L150 310 L150 420 L145 430 L130 420 L135 370 L125 310 Z"
					fill={zoneColor(zones, 'legs')}
					opacity={0.85}
				/>
			</Svg>

			{/* Pressable overlay zones */}
			<Pressable
				style={[styles.zone, {
					top: 4 * scale, left: 120 * scale,
					width: 60 * scale, height: 72 * scale, borderRadius: 30 * scale,
				}]}
				onPress={() => onZonePress('head')}
			/>
			<Pressable
				style={[styles.zone, {
					top: 76 * scale, left: 80 * scale,
					width: 140 * scale, height: 44 * scale,
				}]}
				onPress={() => onZonePress('neck')}
			/>
			<Pressable
				style={[styles.zone, {
					top: 110 * scale, left: 50 * scale,
					width: 50 * scale, height: 155 * scale,
				}]}
				onPress={() => onZonePress('left_arm')}
			/>
			<Pressable
				style={[styles.zone, {
					top: 110 * scale, left: 200 * scale,
					width: 50 * scale, height: 155 * scale,
				}]}
				onPress={() => onZonePress('right_arm')}
			/>
			<Pressable
				style={[styles.zone, {
					top: 115 * scale, left: 95 * scale,
					width: 110 * scale, height: 75 * scale,
				}]}
				onPress={() => onZonePress('chest')}
			/>
			<Pressable
				style={[styles.zone, {
					top: 180 * scale, left: 100 * scale,
					width: 100 * scale, height: 85 * scale,
				}]}
				onPress={() => onZonePress('stomach')}
			/>
			<Pressable
				style={[styles.zone, {
					top: 240 * scale, left: 105 * scale,
					width: 90 * scale, height: 60 * scale,
				}]}
				onPress={() => onZonePress('lower_back')}
			/>
			<Pressable
				style={[styles.zone, {
					top: 300 * scale, left: 120 * scale,
					width: 60 * scale, height: 130 * scale,
				}]}
				onPress={() => onZonePress('legs')}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		alignSelf: 'center',
		position: 'relative',
	},
	zone: {
		position: 'absolute',
	},
});
