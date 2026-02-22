import React, { useState, useRef } from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	Modal,
	StyleSheet,
	Dimensions,
	Pressable,
} from 'react-native';
import { colors, typography, radius } from '../../constants/theme';

interface TooltipProps {
	term: string;
	explanation: string;
	/** Style for the trigger text — defaults look like inline body text with dotted underline */
	style?: object;
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const TOOLTIP_PADDING = 20;

export function Tooltip({ term, explanation, style }: TooltipProps) {
	const [visible, setVisible] = useState(false);
	const [position, setPosition] = useState({ x: 0, y: 0, width: 0 });
	const triggerRef = useRef<View>(null);

	const handlePress = () => {
		triggerRef.current?.measureInWindow((x, y, width, height) => {
			setPosition({ x, y: y + height + 6, width });
			setVisible(true);
		});
	};

	// Compute tooltip left so it stays on-screen
	const tooltipWidth = Math.min(SCREEN_WIDTH - TOOLTIP_PADDING * 2, 280);
	let tooltipLeft = position.x + position.width / 2 - tooltipWidth / 2;
	if (tooltipLeft < TOOLTIP_PADDING) tooltipLeft = TOOLTIP_PADDING;
	if (tooltipLeft + tooltipWidth > SCREEN_WIDTH - TOOLTIP_PADDING) {
		tooltipLeft = SCREEN_WIDTH - TOOLTIP_PADDING - tooltipWidth;
	}

	return (
		<>
			<TouchableOpacity
				ref={triggerRef}
				onPress={handlePress}
				activeOpacity={0.7}
			>
				<Text style={[styles.trigger, style]}>
					{term}
					<Text style={styles.infoIcon}> ⓘ</Text>
				</Text>
			</TouchableOpacity>

			<Modal
				visible={visible}
				transparent
				animationType="fade"
				onRequestClose={() => setVisible(false)}
			>
				<Pressable
					style={styles.backdrop}
					onPress={() => setVisible(false)}
				>
					<View
						style={[
							styles.bubble,
							{
								top: position.y,
								left: tooltipLeft,
								width: tooltipWidth,
							},
						]}
					>
						<Text style={styles.bubbleTitle}>{term}</Text>
						<Text style={styles.bubbleText}>{explanation}</Text>
					</View>
				</Pressable>
			</Modal>
		</>
	);
}

const styles = StyleSheet.create({
	trigger: {
		...typography.body,
		color: colors.navy,
		textDecorationLine: 'underline',
		textDecorationStyle: 'dotted',
		textDecorationColor: colors.navy,
	},
	infoIcon: {
		fontSize: 11,
		color: colors.muted,
	},
	backdrop: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.15)',
	},
	bubble: {
		position: 'absolute',
		backgroundColor: colors.navy,
		borderRadius: radius.md,
		paddingHorizontal: 16,
		paddingVertical: 14,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.15,
		shadowRadius: 12,
		elevation: 8,
	},
	bubbleTitle: {
		fontFamily: 'Inter',
		fontWeight: '600',
		fontSize: 13,
		color: '#FFFFFF',
		marginBottom: 6,
	},
	bubbleText: {
		fontFamily: 'Inter',
		fontWeight: '400',
		fontSize: 13,
		color: 'rgba(255,255,255,0.85)',
		lineHeight: 19,
	},
});
