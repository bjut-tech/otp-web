<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  percentage: number
  strokeWidth?: number
  strokeColor?: string
  strokeClass?: string
  trailWidth?: number
  trailColor?: string
  trailClass?: string
  gapDegree?: number
}>(), {
  strokeWidth: 1,
  strokeColor: '#2db7f5',
  trailWidth: 1,
  trailColor: '#d9d9d9',
  gapDegree: 70
})

const VIEW_BOX_SIZE = 100

const radius = computed(() => {
  return VIEW_BOX_SIZE / 2 - props.strokeWidth / 2
})

const perimeter = computed(() => {
  return 2 * Math.PI * radius.value
})

const rotateDegree = computed(() => {
  return props.gapDegree > 0 ? 90 + props.gapDegree / 2 : -90
})

const perimeterWithoutGap = computed(() => {
  return perimeter.value * ((360 - props.gapDegree) / 360)
})

const trailStyle = computed(() => {
  return {
    strokeDasharray: `${perimeterWithoutGap.value}px ${perimeter.value}`,
    transform: `rotate(${rotateDegree.value}deg)`,
    transformOrigin: '0 0'
  }
})

const strokeStyle = computed(() => {
  let strokeDashoffset = ((100 - props.percentage) / 100) * perimeterWithoutGap.value
  if (props.percentage !== 100) {
    strokeDashoffset += props.strokeWidth / 2
    if (strokeDashoffset >= perimeterWithoutGap.value) {
      strokeDashoffset = perimeterWithoutGap.value - 0.01
    }
  }

  return {
    strokeDasharray: `${perimeterWithoutGap.value}px ${perimeter.value}`,
    strokeDashoffset: strokeDashoffset,
    transform: `rotate(${rotateDegree.value}deg)`,
    transformOrigin: '0 0',
    transition:
      'stroke-dashoffset .3s ease 0s, ' +
      'stroke-dasharray .3s ease 0s, ' +
      'stroke .3s, ' +
      'stroke-width .06s ease .3s, ' +
      'opacity .3s ease 0s'
  }
})
</script>

<template>
  <svg
    :viewBox="`${-VIEW_BOX_SIZE / 2} ${-VIEW_BOX_SIZE / 2} ${VIEW_BOX_SIZE} ${VIEW_BOX_SIZE}`"
    role="presentation"
  >
    <circle
      :class="trailClass"
      :r="radius"
      cx="0"
      cy="0"
      fill-opacity="0"
      :stroke="trailColor"
      stroke-linecap="round"
      :stroke-width="trailWidth || strokeWidth"
      :style="trailStyle"
    />
    <circle
      :class="strokeClass"
      :r="radius"
      cx="0"
      cy="0"
      fill-opacity="0"
      :stroke="strokeColor"
      stroke-linecap="round"
      :stroke-width="strokeWidth"
      :style="strokeStyle"
    />
  </svg>
</template>
