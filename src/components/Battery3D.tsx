import React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Text, Line } from '@react-three/drei'

type Dims = { length: number; width: number; height: number }

function BatteryCase({ length, width, height }: Dims) {
  return (
    <mesh>
      <boxGeometry args={[length, height, width]} />
      <meshStandardMaterial color="#444" metalness={0.3} roughness={0.6} />
    </mesh>
  )
}

function HalfCase({ length, width, height }: Dims) {
  return (
    <mesh position={[length / 4, 0, 0]}>
      <boxGeometry args={[length / 2, height, width]} />
      <meshStandardMaterial color="#444" metalness={0.3} roughness={0.6} transparent opacity={0.5} />
    </mesh>
  )
}

function Lid({ length, width, thickness, height }: Dims & { thickness: number }) {
  return (
    <mesh position={[0, height / 2 + thickness / 2, 0]}>
      <boxGeometry args={[length * 1.02, thickness, width * 1.02]} />
      <meshStandardMaterial color="#333" metalness={0.2} roughness={0.7} />
    </mesh>
  )
}

function CellCells({ dims, lidThk }: { dims: Dims; lidThk: number }) {
  const { length, width, height } = dims
  const count = 6
  const spacing = length / count
  const capRadius = spacing * 0.12
  const capHeight = 0.02
  const y = height / 2 + lidThk + capHeight / 2

  return (
    <group>
      {Array.from({ length: count }, (_, i) => {
        const x = -length / 2 + spacing * (i + 1 / 2)
        return (
          <React.Fragment key={i}>
            <mesh position={[x, y, 0]}>
              <cylinderGeometry args={[capRadius, capRadius, capHeight, 32]} />
              <meshStandardMaterial color="#222" metalness={0.3} roughness={0.7} />
            </mesh>

            <Text position={[x, y + capHeight / 2 + 0.02, 0]} fontSize={0.018} color="#0f0" anchorX="center">
              2V
            </Text>
          </React.Fragment>
        )
      })}

      <Text position={[0, height / 2 + lidThk + capHeight + 0.1, 0]} fontSize={0.025} color="#0f0" anchorX="center">
        6 × 2V = 12V
      </Text>
    </group>
  )
}

function TerminalPost({
  position,
  color,
  radius = 0.01,
  height = 0.02,
}: {
  position: [number, number, number]
  color: string
  radius?: number
  height?: number
}) {
  return (
    <mesh position={position}>
      <cylinderGeometry args={[radius, radius, height, 32]} />
      <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
    </mesh>
  )
}

function Handle({
  length,
  height,
  thickness,
  elevation,
}: {
  length: number
  height: number
  thickness: number
  elevation: number
}) {
  const supportHeight = elevation
  const supportThickness = thickness
  const barThickness = thickness
  const leftX = -length / 2
  const rightX = length / 2
  const postY = height / 2 + supportHeight / 2
  const barY = height / 2 + supportHeight + barThickness / 2

  return (
    <group>
      <mesh position={[leftX, postY, 0]}>
        <boxGeometry args={[supportThickness, supportHeight, supportThickness]} />
        <meshStandardMaterial color="#222" metalness={0.3} roughness={0.7} />
      </mesh>
      <mesh position={[rightX, postY, 0]}>
        <boxGeometry args={[supportThickness, supportHeight, supportThickness]} />
        <meshStandardMaterial color="#222" metalness={0.3} roughness={0.7} />
      </mesh>
      <mesh position={[0, barY, 0]}>
        <boxGeometry args={[length, barThickness, supportThickness]} />
        <meshStandardMaterial color="#222" metalness={0.3} roughness={0.7} />
      </mesh>
    </group>
  )
}

export function InternalAssembly({
  length,
  width,
  height,
  posCount,
  negCount,
}: {
  length: number
  width: number
  height: number
  posCount: number
  negCount: number
}) {
  const electThk = 0.003
  const sepThk = 0.0015
  const plateH = height - 0.02
  const plateW = width - 0.02

  let pos = posCount
  let neg = negCount

  const totalSep = posCount * 2
  const totalPlates = posCount + negCount + totalSep
  const usedThk = (posCount + negCount) * electThk + totalSep * sepThk
  const gap = (length - 0.02 - usedThk) / (totalPlates - 1)

  const layers: React.ReactElement[] = []
  let x = -length / 2 + electThk / 2

  if (neg > 0) {
    layers.push(
      <mesh key="neg-start" position={[x, 0, 0]}>
        <boxGeometry args={[electThk, plateH, plateW]} />
        <meshStandardMaterial color="#5555ff" metalness={0.3} roughness={0.7} />
      </mesh>,
    )
    neg--
    x += electThk + gap
  }

  for (let i = 0; i < posCount; i++) {
    layers.push(
      <mesh key={`sep-before-${i}`} position={[x, 0, 0]}>
        <boxGeometry args={[sepThk, plateH, plateW]} />
        <meshStandardMaterial color="#cccccc" transparent opacity={0.6} />
      </mesh>,
    )
    x += sepThk + gap

    layers.push(
      <mesh key={`pos-${i}`} position={[x, 0, 0]}>
        <boxGeometry args={[electThk, plateH, plateW]} />
        <meshStandardMaterial color="#ff5555" metalness={0.3} roughness={0.7} />
      </mesh>,
    )
    x += electThk + gap

    layers.push(
      <mesh key={`sep-after-${i}`} position={[x, 0, 0]}>
        <boxGeometry args={[sepThk, plateH, plateW]} />
        <meshStandardMaterial color="#cccccc" transparent opacity={0.6} />
      </mesh>,
    )
    x += sepThk + gap

    if (neg > 0) {
      layers.push(
        <mesh key={`neg-${i}`} position={[x, 0, 0]}>
          <boxGeometry args={[electThk, plateH, plateW]} />
          <meshStandardMaterial color="#5555ff" metalness={0.3} roughness={0.7} />
        </mesh>,
      )
      neg--
      x += electThk + gap
    }
  }

  return <group position={[-length / 4, 0, 0]}>{layers}</group>
}

type AnnotationPart = {
  name: string
  pos: [number, number, number]
  labelPos: [number, number, number]
  anchorX?: 'left' | 'right'
}

function Dimensions({ dims, offsetX = 0 }: { dims: Dims; offsetX?: number }) {
  const { length, width, height } = dims
  const offset = 0.05
  return (
    <group position={[offsetX, 0, 0]}>
      <Line points={[[-length / 2, -height / 2 - offset, -width / 2], [length / 2, -height / 2 - offset, -width / 2]]} color="#fff" dashed />
      <Text position={[0, -height / 2 - offset - 0.02, -width / 2]} fontSize={0.03} color="#fff" anchorX="center">{`${(length * 1000).toFixed(0)} mm`}</Text>
      <Line points={[[length / 2 + offset, -height / 2, -width / 2], [length / 2 + offset, -height / 2, width / 2]]} color="#fff" dashed />
      <Text position={[length / 2 + offset + 0.02, -height / 2, 0]} rotation={[0, Math.PI / 2, 0]} fontSize={0.03} color="#fff" anchorX="center">{`${(width * 1000).toFixed(0)} mm`}</Text>
      <Line points={[[length / 2 + offset * 2, -height / 2, width / 2], [length / 2 + offset * 2, height / 2, width / 2]]} color="#fff" dashed />
      <Text position={[length / 2 + offset * 2 + 0.02, 0, width / 2]} fontSize={0.03} color="#fff" anchorX="center">{`${(height * 1000).toFixed(0)} mm`}</Text>
    </group>
  )
}

interface AnnotationsProps {
  dims: Dims
  lidThk: number
  postHeight: number
  handleElevation: number
}

export function Annotations({ dims, lidThk, postHeight, handleElevation }: AnnotationsProps) {
  const { length, width, height } = dims
  const plateZ = (width - 0.02) / 2
  const termY = height / 2 + lidThk + postHeight / 2

  const parts: AnnotationPart[] = [
    {
      name: 'Positive Terminal',
      pos: [length / 4, termY, plateZ],
      labelPos: [length / 4 + 0.1, termY + 0.1, plateZ + 0.05],
      anchorX: 'left',
    },
    {
      name: 'Negative Terminal',
      pos: [-length / 4, termY, plateZ],
      labelPos: [-length / 4 - 0.1, termY + 0.1, plateZ + 0.05],
      anchorX: 'right',
    },
    {
      name: 'Lid',
      pos: [0, height / 2 + lidThk / 2, 0],
      labelPos: [0.2, height / 2 + lidThk + 0.05, 0],
      anchorX: 'left',
    },
    {
      name: 'Handle',
      pos: [0, height / 2 + lidThk + handleElevation + 0.01, 0],
      labelPos: [-0.3, height / 2 + lidThk + handleElevation + 0.2, 0],
      anchorX: 'left',
    },
  ]

  return (
    <group>
      {parts.map((p, i) => (
        <React.Fragment key={i}>
          <Line points={[p.pos, p.labelPos]} color="#ff0" lineWidth={1} />
          <Text position={p.labelPos} fontSize={0.013} color="#ff0" anchorX={p.anchorX ?? 'left'}>
            {p.name}
          </Text>
        </React.Fragment>
      ))}
    </group>
  )
}

function Legend({ dims }: { dims: Dims }) {
  const { length, width, height } = dims
  const size = 0.02
  const padding = 0.01
  const startY = height / 2 + 0.05
  const startX = length / 2 + 0.05
  const z = 0

  const entries = [
    { color: '#ff5555', label: 'Positive Electrode' },
    { color: '#5555ff', label: 'Negative Electrode' },
    { color: '#cccccc', label: 'Separator' },
  ]

  return (
    <group>
      {entries.map((e, i) => (
        <React.Fragment key={i}>
          <mesh position={[startX, startY - i * (size + padding), z]}>
            <boxGeometry args={[size, size, size]} />
            <meshStandardMaterial color={e.color} />
          </mesh>
          <Text position={[startX + size + padding, startY - i * (size + padding), z]} fontSize={0.025} color="#fff" anchorX="left">
            {e.label}
          </Text>
        </React.Fragment>
      ))}
    </group>
  )
}

export function Battery3D({
  length,
  width,
  height,
  posCount,
  negCount,
  lidThk = 0.012,
  postHeight = 0.03,
  postRadius = 0.01,
  handleThickness = 0.015,
  handleElevation = 0.16,
  scale = 2,
  separation = 0.3,
}: {
  length: number
  width: number
  height: number
  posCount: number
  negCount: number
  lidThk?: number
  postHeight?: number
  postRadius?: number
  handleThickness?: number
  handleElevation?: number
  scale?: number
  separation?: number
}) {
  const dims = { length, width, height }
  const offsetX = (length * scale) / 2 + separation
  const posPostPos: [number, number, number] = [length / 4, height / 2 + lidThk + postHeight / 2, width / 2.5]
  const negPostPos: [number, number, number] = [-length / 4, height / 2 + lidThk + postHeight / 2, width / 2.5]

  return (
    <Canvas
      camera={{ position: [3, 2, 3], fov: 60, near: 0.01, far: 100 }}
      style={{ width: '100%', height: '100vh', backgroundImage: 'linear-gradient(to right, rgb(27, 28, 33), rgb(44, 45, 49), rgb(61, 62, 66))' }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[2, 3, 1]} intensity={1} />

      <group position={[-offsetX, 0, 0]} scale={[scale, scale, scale]}>
        <BatteryCase {...dims} />
        <Lid {...dims} thickness={lidThk} />
        <CellCells dims={dims} lidThk={lidThk} />
        <TerminalPost position={posPostPos} color="#e50000" radius={postRadius} height={postHeight} />
        <TerminalPost position={negPostPos} color="#000" radius={postRadius} height={postHeight} />
        <Handle length={length} height={height} thickness={handleThickness} elevation={handleElevation} />
        <Dimensions dims={dims} offsetX={0} />
      </group>

      <group position={[offsetX, 0, 0]} scale={[scale, scale, scale]}>
        <HalfCase {...dims} />
        <Lid {...dims} thickness={lidThk} />
        <CellCells dims={dims} lidThk={lidThk} />
        <TerminalPost position={posPostPos} color="#e50000" radius={postRadius} height={postHeight} />
        <TerminalPost position={negPostPos} color="#000" radius={postRadius} height={postHeight} />
        <Handle length={length} height={height} thickness={handleThickness} elevation={handleElevation} />
        <InternalAssembly length={length} width={width} height={height} posCount={posCount} negCount={negCount} />
        <Annotations dims={dims} lidThk={lidThk} postHeight={postHeight} handleElevation={handleElevation} />
      </group>

      <group position={[offsetX + (length * scale) / 2 + 0.05, 0, 0]}>
        <Legend dims={dims} />
      </group>

      <OrbitControls target={[0, 0, 0]} />
    </Canvas>
  )
}
