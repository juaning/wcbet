import React, { useState, useEffect } from "react";
import styled from 'styled-components';
import { Form, Formik, Field } from "formik";
import { Autocomplete, AutocompleteRenderInputParams, TextField } from "formik-mui";
import { useAuth0 } from "@auth0/auth0-react";
import { cup2022API, cup2022Options, TeamBetTypeEnum, canBetChamNGroups } from '../../config'; 
import Autosave from "./Autosave";

export interface ITeam {
  _id: string;
  name_en: string;
  name_fa: string;
  flag: string;
  fifa_code: string;
  iso2: string;
  groups: string;
  id: string;
}

export interface ITeamBet {
  id?: string;
  teamId: string;
  instance: TeamBetTypeEnum;
  groupId?: string | null;
  matchId?: string | null;
}

const ChampionReadOnlyContainer = styled.h2`
  img {
    width: 50px;
    height: 30px;
    border: 1px solid black;
    border-radius: 5px;
    margin-right: 15px;
    vertical-align: middle;
  }
`

const Champion = () => {
  const [teams, setTeams] = useState<Array<ITeam>>([]);
  const [championBet, setChampionBet] = useState<ITeamBet>();
  const [champion, setChampion] = useState<ITeam>({
    _id: '',
    name_en: '',
    name_fa: '',
    flag: '',
    fifa_code: '',
    iso2: '',
    groups: '',
    id: '',
  });
  const { getAccessTokenSilently } = useAuth0();

  const saveTeamBet = async (values: ITeamBet, isUpdate: boolean = false): Promise<ITeamBet> => {
    const token = await getAccessTokenSilently()
    const fetchOptions = {
      ...cup2022Options,
      method: isUpdate ? "PUT" : "POST",
      headers: {
        ...cup2022Options.headers,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(values),
    }
    const response = await fetch(`${cup2022API}/user-team-bet`, fetchOptions);
    return response.json();
  }

  useEffect(() => {
    getAccessTokenSilently().then(token => {
      const fetchOptions = {
        ...cup2022Options,
        headers: {
          ...cup2022Options.headers,
          Authorization: `Bearer ${token}`
        }
      };
      
      const fetchTeams = fetch(`${cup2022API}/api-wc2022`, cup2022Options);
      const fetchChampion = fetch(`${cup2022API}/user-team-bet/instance/${TeamBetTypeEnum.CHAMPION}`, fetchOptions)
      Promise.all([fetchTeams, fetchChampion])
        .then((results) => Promise.all(results.map(r => r.json())))
        .then(([fetchedTeams, fetchedChampion]) => {
          if (fetchedChampion.length > 0) {
            // There's only one champ
            const championTeam = fetchedTeams.find(
              (team: ITeam) => team.id === fetchedChampion[0].teamId
            );
            setChampion(championTeam);
            setChampionBet(fetchedChampion[0]);
          }
          setTeams(fetchedTeams);
        })
        .catch(err => console.error(err));
    })
  }, []);

  if (canBetChamNGroups()) {
    if (champion && champion.flag) {
      return (
        <ChampionReadOnlyContainer>
          Tu campeon: <img src={champion?.flag} alt={`Flag from ${champion?.name_en}`} />
          <span>{champion?.name_en}</span>
        </ChampionReadOnlyContainer>)
    }
    return null;
  }

  return (
    <Formik
      enableReinitialize
      initialValues={{
        champion: champion,
      }}
      onSubmit={async (values, { setSubmitting}) => {
        const data: ITeamBet = {
          teamId: values.champion ? values.champion.id : '',
          instance: TeamBetTypeEnum.CHAMPION,
        }
        try {
          if (!champion || !champion.id) {
            const newChamp: ITeamBet = await saveTeamBet(data);
            const team = teams.find(t => t.id === newChamp.teamId);
            if (team) {
              setChampion(team);
              setChampionBet(newChamp);
            }
          } else {
            const updateData = {...data, id: championBet?.id};
            saveTeamBet(updateData, true);
          }
        } catch (error) {
          console.error(error);
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {() => (
        <Form>
          <Field
            name="champion"
            component={Autocomplete}
            options={teams}
            getOptionLabel={(option: any) => option.name_en || ''}
            isOptionEqualToValue={(option: ITeam, value: ITeam) => option.id === value.id}
            renderInput={(params: AutocompleteRenderInputParams) => {
              return(
                <Field
                  {...params}
                  component={TextField}
                  defaultValue={champion}
                  name="champion"
                  label="Campeon"
                />
            )}}
          />
          <Autosave debounceMs={1000} />
        </Form>
      )}
    </Formik>
  )
}

export default Champion;