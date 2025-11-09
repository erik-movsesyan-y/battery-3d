type CalcInputs = {
  K_usage_plus: number
  K_usage_minus?: number
  a_plus_PbSO4: number
  a_minus_PbSO4: number
  l_plus: number
  h_plus: number
  delta_l_sep: number
  delta_plus?: number
  delta_minus?: number
  delta_h: number
  wall_thk: number
  lid_thk: number
  base_thk: number
  bonnet_h: number
  delta_g_plus?: number
  delta_g_minus?: number
  g_grid?: number
}

type CalcResult = {
  Qp: number
  G_PbSO4_plus: number
  G_PbSO4_minus: number
  G_plus: number
  N_plus: number
  N_minus: number
  dims: {
    internal: { length: number; width: number; height: number }
    external: { length: number; width: number; height: number }
  }
}

export function calcBattery(Qn: number, params: CalcInputs): CalcResult {
  const {
    K_usage_plus,
    K_usage_minus,
    a_plus_PbSO4,
    a_minus_PbSO4,
    l_plus,
    h_plus,
    delta_l_sep,
    delta_plus = 4.6,
    delta_minus = 4.2,
    delta_h,
    wall_thk,
    lid_thk,
    base_thk,
    bonnet_h,
    delta_g_plus = 120,
    delta_g_minus = 110,
    g_grid = 110,
  } = params

  const K_PbSO4 = 303 / (2 * 26.8)
  const Qp = 1.2 * Qn

  const G_PbSO4_plus = (Qp * K_PbSO4) / K_usage_plus
  const G_plus = G_PbSO4_plus / a_plus_PbSO4
  const N_plus = Math.ceil(G_plus / delta_g_plus)

  const N_minus = N_plus + 1
  const G_minus = delta_g_minus * N_minus
  const G_PbSO4_minus = G_minus * a_minus_PbSO4

  const B_in = N_plus * delta_plus + N_minus * delta_minus
  const A_in = l_plus + 2 * delta_l_sep
  const C_in = h_plus + delta_h

  const B_out = B_in + 2 * wall_thk
  const A_out = A_in + 2 * wall_thk
  const C_out = C_in + lid_thk + base_thk + bonnet_h

  return {
    Qp,
    G_PbSO4_plus,
    G_PbSO4_minus,
    G_plus,
    N_plus,
    N_minus,
    dims: {
      internal: { length: A_in / 1000, width: B_in / 1000, height: C_in / 1000 },
      external: { length: A_out / 1000, width: B_out / 1000, height: C_out / 1000 },
    },
  }
}
