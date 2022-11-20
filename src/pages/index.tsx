import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {
  Box,
  Container,
  ImageList,
  ImageListItem,
  ListSubheader,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import Head from '../components/Helpers/Head'
import ResponsiveAppBar from "../components/BarMenu/BarMenu";
import itau from '../../static/itau-qr.jpg';
import mango from '../../static/mango-qr.jpg';
import { Link } from "gatsby";
import ChampNGroupsBetNotification from "../components/Notification/Notification";

const pointsRows = [
  { desc: 'Acierto de ganador o empate primera ronda', pts: 10 },
  { desc: 'Resultado primera ronda', pts: 20 },
  { desc: 'Clasificado a octavos de final en su posición.', pts: 60 },
  { desc: 'Clasificado a octavos de final fuera de su posición.', pts: 40 },
  { desc: 'Clasificado a cuartos de final.', pts: 100 },
  { desc: 'Clasificado a semifinal.', pts: 140 },
  { desc: 'Clasificado a la final.', pts: 180 },
  { desc: 'Campeón', pts: 250 },
  { desc: 'Resultado en octavos de final', pts: 100 },
  { desc: 'Resultado en cuartos de final', pts: 150 },
  { desc: 'Resultado en semifinal', pts: 200 },
  { desc: 'Resultado en la final', pts: 250 },
];

const qrs = [
  { img: itau, title: 'ITAU', subtitle: 'Escanea con la app de Itau Pagos' },
  { img: mango, title: 'MANGO (@roquito07)', subtitle: 'Escanea con la app de Mango' },
]

const Main = () => {
  const { user, logout, loginWithPopup, isAuthenticated } = useAuth0();
  return (
  <Container>
    <Head title="Home page" />
    <ResponsiveAppBar
      login={isAuthenticated ? undefined : loginWithPopup}
      logout={isAuthenticated ? logout : undefined}
      user={isAuthenticated ? user : undefined}
    />
    <ChampNGroupsBetNotification />
    <Box sx={{ width: '100%', maxWidth: 640, margin: 'auto' }}>
      <Typography variant="h4" gutterBottom>Reglamento | <Link to="/account">Mis apuestas</Link></Typography>
      <Typography variant="h6" gutterBottom sx={{fontWeight: 'bold'}}>1. Costo</Typography>
      <Typography variant="body1" gutterBottom>
        El jugador que desea participar deberá abonar la suma de 100.000 Gs para apostar partido a partido durante todo el mundial. Adicionalmente puede apostar por el campeón antes de iniciar el mundial con un costo de 50.000 Gs.
        <ImageList>
          <ImageListItem key="Subheader" cols={2}>
            <ListSubheader component="div">Medios de pago.</ListSubheader>
          </ImageListItem>
          {qrs.map(qr => (
            <ImageListItem key={qr.title}>
              <img
                src={`${qr.img}?w=248&fit=crop&auto=format`}
                srcSet={`${qr.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
                alt={qr.title}
                loading="lazy"
                style={{ objectFit: 'fill'}}
              />
              <Typography variant="subtitle1" align="right" gutterBottom sx={{fontWeight: 'bold'}}>{qr.title}</Typography>
              <Typography variant="body1" align="right" gutterBottom>{qr.subtitle}</Typography>
            </ImageListItem>
          ))}
        </ImageList>
      </Typography>
      <Typography variant="h6" gutterBottom sx={{fontWeight: 'bold'}}>2. Primera ronda</Typography>
      <Typography variant="body1" gutterBottom>
        Se deberá anotar el resultado de cada partido, obteniendo 10 puntos por adivinar quién es el ganador o si es empate y 20 puntos extras si se adivina el resultado.
        En base a los resultados anotados la planilla calculará automáticamente los clasificados a Octavos de final.
      </Typography>
      <Typography variant="h6" gutterBottom sx={{fontWeight: 'bold'}}>3. Octavos de final</Typography>
      <Typography variant="body1" gutterBottom>
        <Typography sx={{ textDecoration: 'underline' }}>Equipo clasificado en su posición.</Typography><br />
        El jugador obtendrá 60 puntos por adivinar la clasificación de un equipo en la misma posición en que clasifico en el mundial. Ejemplo: si Brasil clasifica como 1º de su grupo y usted apostó que saldría primero obtiene 60 puntos.<br />
        <br /><Typography sx={{ textDecoration: 'underline' }}>Equipo clasificado fuera de su posición.</Typography><br />
        El jugador obtiene 40 puntos por adivinar la clasificación de un equipo en una posición distinta a la del mundial. Ejemplo: Si Brasil clasifica como segundo y usted apostó que clasificaría primero obtiene 40 puntos.<br />
        <br /><Typography sx={{ textDecoration: 'underline' }}>Resultado</Typography><br />
        Deberá anotar el resultado de cada emparejamiento de octavos de final teniendo en cuenta solamente los 90 minutos de juego del partido sin alargue. En caso de apostar empate deberá seleccionar el clasificado a la siguiente ronda. La planilla completará en base a los resultados automáticamente los clasificados a cuartos de final.<br /><br />
        El jugador obtiene 100 puntos extras solamente si adivina ambos clasificados de un determinado partido en su posición y además adivina el resultado del partido.
      </Typography>
      <Typography variant="h6" gutterBottom sx={{fontWeight: 'bold'}}>4. Cuartos de final</Typography>
      <Typography variant="body1" gutterBottom>
        <Typography sx={{ textDecoration: 'underline' }}>Equipo clasificado en su posición.</Typography><br />
        El jugador obtendrá 100 puntos por adivinar la clasificación de un equipo en la misma posición en que clasifico en el mundial. Ejemplo: si Brasil clasifica como 1º de su grupo y llega a cuartos de final y usted apostó que alcanzaría cuartos de final obtiene 100 puntos.<br />
        <br /><Typography sx={{ textDecoration: 'underline' }}>Resultado</Typography><br />
        Deberá anotar el resultado de cada emparejamiento de cuartos de final teniendo en cuenta solamente los 90 minutos de juego del partido sin alargue. En caso de apostar empate deberá seleccionar el clasificado a la siguiente ronda. La planilla completará en base a los resultados automáticamente los clasificados a semifinal.<br /><br />
        El jugador obtiene 150 puntos extras solamente si adivina ambos clasificados de un determinado partido en su posición y además adivina el resultado del partido.
      </Typography>
      <Typography variant="h6" gutterBottom sx={{fontWeight: 'bold'}}>5. Semifinales</Typography>
      <Typography variant="body1" gutterBottom>
        <Typography sx={{ textDecoration: 'underline' }}>Equipo clasificado en su posición.</Typography><br />
        El jugador obtendrá 140 puntos por adivinar la clasificación de un equipo en la misma posición en que clasifico en el mundial. Ejemplo: si Brasil clasifica como 1º de su grupo y llega a semifinal y usted apostó que alcanzaría la semifinal obtiene 140 puntos.<br />
        <br /><Typography sx={{ textDecoration: 'underline' }}>Resultado</Typography><br />
        Deberá anotar el resultado de cada emparejamiento de semifinales teniendo en cuenta solamente los 90 minutos de juego del partido sin alargue. En caso de apostar empate deberá seleccionar el clasificado a la siguiente ronda. La planilla completará en base a los resultados automáticamente los clasificados a semifinal.<br /><br />
        El jugador obtiene 200 puntos extras solamente si adivina ambos clasificados de un determinado partido en su posición y además adivina el resultado del partido.
      </Typography>
      <Typography variant="h6" gutterBottom sx={{fontWeight: 'bold'}}>6. Final</Typography>
      <Typography variant="body1" gutterBottom>
        <Typography sx={{ textDecoration: 'underline' }}>Equipo clasificado en su posición.</Typography><br />
        El jugador obtendrá 180 puntos por adivinar la clasificación de un equipo en la misma posición en que clasifico en el mundial. Ejemplo: si Brasil clasifica como 1º de su grupo y llega a la final y usted apostó que alcanzaría la final obtiene 180 puntos.<br />
        <br /><Typography sx={{ textDecoration: 'underline' }}>Resultado</Typography><br />
        Deberá anotar el resultado del enfrentamiento de la final teniendo en cuenta solamente los 90 minutos de juego sin alargue. En caso de apostar empate deberá seleccionar el campeón. La planilla completará en base a los resultados automáticamente el campeón.<br /><br />
        El jugador obtiene 250 puntos extras solamente si adivina ambos clasificados a la final en su posición y además adivina el resultado del partido.
      </Typography>
      <Typography variant="h6" gutterBottom sx={{fontWeight: 'bold'}}>7. Campeón</Typography>
      <Typography variant="body1" gutterBottom>
        El jugador obtiene 270 puntos si adivina el campeón del mundial.
      </Typography>
      <Typography variant="h6" gutterBottom sx={{fontWeight: 'bold'}}>8. Premio</Typography>
      <Typography variant="body1" gutterBottom>
        El participante que obtenga el mayor puntaje acumulado ganará el 70% del pozo acumulado (correspondiente a la apuesta de 100.000 Gs.). En caso de empate el 100% del monto se dividirá entre los ganadores y no habrá premio para el segundo.<br /><br />
        El participante que obtenga el segundo mejor puntaje recibirá el 30% del pozo acumulado.<br /><br />
        En caso de empate este monto(30% del pozo) se dividirá entre los que empaten en segundo lugar.<br /><br />
        Para la apuesta de campeón (50.000 Gs) el 100% del pozo será para quien adivine el campeón antes de iniciar el mundial. En caso que hayan varias personas que adivinaron el campeón, el pozo acumulada se dividirá en partes iguales entre ellos.<br /><br />
      </Typography>
    </Box>
    <Box sx={{ width: '100%', maxWidth: 640, margin: 'auto' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>Acierto</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Puntaje</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pointsRows.map(row => (
            <TableRow
              key={row.desc}
              sx={{ '&:last-child td, &:last-child th': { border: 0 }}}
            >
              <TableCell component="th" scope="row">{row.desc}</TableCell>
              <TableCell align="right">{row.pts}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  </Container>
)};

export default Main;