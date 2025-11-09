import React, { useState } from 'react'
import { calcBattery } from './utils/calcBattery'
import { Battery3D } from './components/Battery3D'
import {
  Container, Paper, Typography, Box,
  Grid, TextField, Button
} from '@mui/material'

export default function App() {
  const defaultForm = {
    Qn: '92',
    K_usage_plus: '0.55',
    a_plus_PbSO4: '0.90',
    a_minus_PbSO4: '0.96',
    l_plus: '183',
    h_plus: '170',
    delta_l_sep: '3.5',
    delta_h: '5.5',
    wall_thk: '5',
    lid_thk: '3',
    base_thk: '5',
    bonnet_h: '15',
  };

  const emptyForm = Object.fromEntries(
    Object.keys(defaultForm).map((k) => [k, ''])
  );
  const [form, setForm] = useState(emptyForm);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleLoadDefaults = () => {
    setForm(defaultForm);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const numeric = {
      Qn: parseFloat(form.Qn),
      K_usage_plus: parseFloat(form.K_usage_plus),
      a_plus_PbSO4: parseFloat(form.a_plus_PbSO4),
      a_minus_PbSO4: parseFloat(form.a_minus_PbSO4),
      l_plus: parseFloat(form.l_plus),
      h_plus: parseFloat(form.h_plus),
      delta_l_sep: parseFloat(form.delta_l_sep),
      delta_h: parseFloat(form.delta_h),
      wall_thk: parseFloat(form.wall_thk),
      lid_thk: parseFloat(form.lid_thk),
      base_thk: parseFloat(form.base_thk),
      bonnet_h: parseFloat(form.bonnet_h),
    };
    const res = calcBattery(numeric.Qn, numeric);
    setResult(res);
  };


  const fields = [
    { name: 'Qn', placeholder: 'Nominal capacity', step: 1 },
    { name: 'K_usage_plus', placeholder: 'PbSO₄ utilization coefficient', step: 0.01, min: 0.55, max: 0.65 },
    { name: 'a_plus_PbSO4', placeholder: 'PbSO₄ content in positive active mass', step: 0.01, min: 0.90, max: 0.93 },
    { name: 'a_minus_PbSO4', placeholder: 'PbSO₄ content in negative active mass', step: 0.01, min: 0.94, max: 0.96 },
    { name: 'l_plus', placeholder: 'Electrode length', step: 1 },
    { name: 'h_plus', placeholder: 'Electrode height', step: 1 },
    { name: 'delta_l_sep', placeholder: 'Separator protrusion width from electrode', step: 0.1, min: 2.5, max: 3.5 },
    { name: 'delta_h', placeholder: 'Height from electrode to base', step: 0.1 },
    { name: 'wall_thk', placeholder: 'Battery case wall thickness', step: 0.5 },
    { name: 'lid_thk', placeholder: 'Case lid thickness', step: 0.5 },
    { name: 'base_thk', placeholder: 'Case base thickness', step: 0.5 },
    { name: 'bonnet_h', placeholder: 'Case bonnet height', step: 1 }
  ];

  return (
    <Container maxWidth="100%" sx={{ py: 4, position: 'sticky', top: 0, backgroundImage: 'linear-gradient(to right, rgb(27, 28, 33), rgb(44, 45, 49), rgb(61, 62, 66))', zIndex: 1100 }}>
      <Paper sx={{ p: 3, backgroundColor: '#cccccc' }}>


        <Typography variant="h6" gutterBottom>
          Structural calculation of the battery
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
          {fields.map((fld) => (
            <TextField
              sx={{ width: '32%', p: 1 }}
              name={fld.name}
              label={fld.placeholder}
              placeholder={fld.placeholder}
              type="number"
              value={form[fld.name]}
              onChange={handleChange}
              inputProps={{
                step: fld.step,
                min: fld.min,
                max: fld.max
              }}
            />
          ))}

          <Box sx={{ display: 'flex', gap: 2, my: 2, justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={handleLoadDefaults}>
              Load default values
            </Button>
            <Button variant="contained" type="submit">
              Calculate & Generate 3D Model
            </Button>
          </Box>
        </Box>
      </Paper>
      {result && (
        <>
          {result && (
            <>
              <Box sx={{ mb: 4, backgroundImage: 'linear-gradient(to right, rgb(27, 28, 33), rgb(44, 45, 49), rgb(61, 62, 66))', }}>
                <Typography variant="h6" gutterBottom>
                  Calculation Results
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} md={4}>
                    <Typography>
                      Q<sub>p</sub> (actual capacity): {result.Qp.toFixed(2)} Ah
                    </Typography>
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <Typography>
                      PbSO₄⁺ : {result.G_PbSO4_plus.toFixed(1)} g
                    </Typography>
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <Typography>
                      PbSO₄<sup>−</sup> : {result.G_PbSO4_minus.toFixed(1)} g
                    </Typography>
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <Typography>
                      G⁺ : {result.G_plus.toFixed(1)} g
                    </Typography>
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <Typography>
                      # positive electrodes (N⁺): {result.N_plus}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <Typography>
                      # negative electrodes (N⁻): {result.N_minus}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" gutterBottom>
                      Internal dimensions (mm)
                    </Typography>
                    <Typography>
                      A: {(result.dims.internal.length * 1000).toFixed(3)} mm
                    </Typography>
                    <Typography>
                      B: {(result.dims.internal.width * 1000).toFixed(3)} mm
                    </Typography>
                    <Typography>
                      C: {(result.dims.internal.height * 1000).toFixed(3)} mm
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" gutterBottom>
                      External dimensions (mm)
                    </Typography>
                    <Typography>
                      A: {(result.dims.external.length * 1000).toFixed(0)} mm
                    </Typography>
                    <Typography>
                      B: {(result.dims.external.width * 1000).toFixed(0)} mm
                    </Typography>
                    <Typography>
                      C: {(result.dims.external.height * 1000).toFixed(0)} mm
                    </Typography>
                  </Grid>
                </Grid>
              </Box>


            </>
          )}

          <Box >
            <Battery3D
              length={result.dims.external.length}
              width={result.dims.external.width}
              height={result.dims.external.height}
              posCount={result.N_plus}
              negCount={result.N_minus}
            />
          </Box>
        </>
      )}
    </Container>
  )
}
