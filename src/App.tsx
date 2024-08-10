import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import PointsLineChart, { EventsPerYear, PointsPerYear } from './components/points-line-chart';
import { FootballScoresMatchListData, Event, Team, EventOutcome } from './models/football-scores-match-list';
import { AbbrLink, SportsTableData } from './models/sports-table-data';
// import { v4 as uuidv4 } from 'uuid';

type TeamNameInfo = {
  linkText: string;
  fullName: string;
}

const defaultTeamNameInfo: TeamNameInfo = {
  linkText: "bristol-city",
  fullName: "Bristol City"
};

const competitionNames = [
  "premier-league",
  "championship",
  "league-one",
  "league-two",
  "scottish-premiership",
  "spanish-la-liga"
];

const minimumYear = 2019; // 2018; //2017;
const maximumYear = 2024; // 2023 //2022;

function App() {
  // const [footballScoresMatchListData, setFootballScoresMatchListData] = useState<
  //   FootballScoresMatchListData | undefined
  // >(undefined);

  // const [tournamentDatesWithEvents, setTournamentDatesWithEvents] = useState<
  //   TournamentDatesWithEvents | undefined
  // >(undefined);

  // const [leagueEvents, setLeagueEvents] = useState<
  //   Event[] | undefined
  // >(undefined);

  // const [points2020, setPoints2020] = useState<
  //   number[]
  // >([]);

  const [pointsPerYear, setPointsPerYear] = useState<
    PointsPerYear | undefined
  >(undefined);

  const [eventsPerYear, setEventsPerYear] = useState<
    EventsPerYear | undefined
  >(undefined);

  const [teamNameLinkTextItems, setTeamNameLinkTextItems] = useState<
    (string | undefined)[] | []
  >([]);

  const [teamNameInfoItems, setTeamNameInfoItems] = useState<
    (TeamNameInfo | undefined)[] | []
  >([]);

  const [selectedTeamNameInfoItem, setSelectedTeamNameInfoItem] = useState<
    TeamNameInfo
  >(defaultTeamNameInfo);

  const [loading, setLoading] = useState<
    boolean
  >(false);

  // // https://push.api.bbci.co.uk/batch?t=/data/bbc-morph-sport-tables-data/competition/championship/sport/football/version/2.0.2?timeout=5
  useEffect(() => {
    const fetchSportsTableData = async () => {
      // const pointsPerYear: PointsPerYear = {};

      const allTeamNameAbbrLinks: (AbbrLink | undefined)[] = [];
      const allTeamNameLinkTextItems: (string | undefined)[] = [];

      for (let competitionNameIndex = 0; competitionNameIndex < competitionNames.length; competitionNameIndex++) {
        const competitionName = competitionNames[competitionNameIndex];
        const url = `https://push.api.bbci.co.uk/batch?t=/data/bbc-morph-sport-tables-data/competition/${competitionName}/sport/football/version/2.0.2?timeout=5`;

        const responseJson = await fetch(url);
        const responseSportsTableData: SportsTableData = await responseJson.json();
        const teamRows = responseSportsTableData?.payload[0].body.sportTables.tables[0].rows;

        const teamNameAbbrLinks = teamRows.map(teamRow => teamRow.cells[2].td.abbrLink); // .filter(i => i !== undefined);
        const teamNameLinkTextItems = teamNameAbbrLinks.map(teamNameAbbrLink => teamNameAbbrLink ? teamNameAbbrLink.link.split("/").slice(-1)[0] : null);

        allTeamNameAbbrLinks.push(...teamNameAbbrLinks);

        const defined: string[] = [];

        teamNameLinkTextItems.forEach(i => {
          if (i != null) {
            defined.push(i);
          }
        });

        allTeamNameLinkTextItems.push(...defined);
      }

      const allTeamNameInfoItems: (TeamNameInfo | undefined)[] = allTeamNameAbbrLinks.map(teamNameAbbrLink => {
        if (teamNameAbbrLink === undefined) {
          return undefined;
        }

        const linkText = teamNameAbbrLink.link.split("/").slice(-1)[0];

        return {
          linkText,
          fullName: teamNameAbbrLink.text
        }
      });

      allTeamNameLinkTextItems.sort();
      setTeamNameLinkTextItems(allTeamNameLinkTextItems);

      const allTeamNameInfoItemsDefined = allTeamNameInfoItems.filter(i => i !== undefined);

      allTeamNameInfoItemsDefined.sort((a: TeamNameInfo | undefined, b: TeamNameInfo | undefined) => {
        if (a === undefined) {
          return 0;
        }

        if (b === undefined) {
          return 0;
        }

        if (a.fullName < b.fullName) {
          return -1;
        }
        if (a.fullName > b.fullName) {
          return 1;
        }
        // a must be equal to b
        return 0;
      });

      setTeamNameInfoItems(allTeamNameInfoItemsDefined);

      // setLoading(false);
    };

    fetchSportsTableData();

  }, []);

  useEffect(() => {
    const fetchMatchListData = async () => {
      setLoading(true);

      const getEventPoints = (event: Event) => {
        const team: Team = event.homeTeam.name.full === selectedTeamNameInfoItem.fullName ? event.homeTeam : event.awayTeam;
        const otherTeam: Team = event.homeTeam.name.full !== selectedTeamNameInfoItem.fullName ? event.homeTeam : event.awayTeam;

        if (event.eventProgress.status === "LIVE") {
          // console.warn(JSON.stringify(team, null, 2));
          const teamScore = team.scores.score;
          const otherTeamScore = otherTeam.scores.score;

          if (teamScore < otherTeamScore) {
            return 0;
          }

          if (teamScore > otherTeamScore) {
            return 3;
          }

          return 1;
        }

        const points = team.eventOutcome === "loss" ? 0 : team.eventOutcome === "win" ? 3 : 1;

        return points;
      }

      const pointsPerYear: PointsPerYear = {};
      const eventsPerYear: EventsPerYear = {};

      // const minimumYear = 2017;
      // const maximumYear = 2022;

      for (let year = maximumYear; year >= minimumYear; year--) {
        const startDateISO = `${year}-07-29`; // Was 08-01 - Scottish football started on 31 July
        const endDateISO = `${year + 1}-07-28`;
        const todayISO = new Date().toISOString().substr(0, 10);

        // const tValue = `%2Fdata%2Fbbc-morph-football-scores-match-list-data%2FendDate%2F${endDateISO}%2FstartDate%2F${startDateISO}%2Fteam%2F${selectedTeamNameInfoItem.linkText}%2FtodayDate%2F${todayISO}%2Fversion%2F2.4.6?timeout=5&c=${uuidv4()}`;
        const tValue = `%2Fdata%2Fbbc-morph-football-scores-match-list-data%2FendDate%2F${endDateISO}%2FstartDate%2F${startDateISO}%2Fteam%2F${selectedTeamNameInfoItem.linkText}%2FtodayDate%2F${todayISO}%2Fversion%2F2.4.6?timeout=5`;

        const url = `https://push.api.bbci.co.uk/batch?t=${tValue}`;

        const responseJson = await fetch(url);
        const responseData = await responseJson.json();
        const responseFootballScoresMatchListData: FootballScoresMatchListData = responseData as FootballScoresMatchListData;

        const payloadItems = responseFootballScoresMatchListData?.payload;
        const payloadItem = payloadItems && payloadItems.length > 0 ? payloadItems[0] : null;
        const matchDataItems = payloadItem?.body?.matchData;
        const tournamentDatesWithEvents = matchDataItems && matchDataItems.length > 0 ? matchDataItems[0]?.tournamentDatesWithEvents : null;

        // setFootballScoresMatchListData(responseFootballScoresMatchListData);
        // setTournamentDatesWithEvents(responseFootballScoresMatchListData?.payload[0].body.matchData[0].tournamentDatesWithEvents);

        const leagueEventsTemp: Event[] = [];

        const leagueNames = [...competitionNames];
        leagueNames.push("national-league");

        if (tournamentDatesWithEvents) {
          responseFootballScoresMatchListData.payload[0].body.matchData.forEach(matchDataItem => {
            Object.keys(matchDataItem.tournamentDatesWithEvents).forEach(key => matchDataItem.tournamentDatesWithEvents[key][0].events.forEach(ev => {
              if (leagueNames.indexOf(ev.tournamentSlug) === -1) {
                console.warn(`${ev.tournamentSlug}`);
              }

              if (ev.eventProgress.status !== "RESULT") {
                // FIXTURE
                // POSTPONED
                // LIVE
                console.warn(`${ev.tournamentSlug} : ${ev.eventProgress.status}`);
              }

              // if (ev.eventProgress.status === "LIVE") {
              //   console.warn(`${JSON.stringify(ev)}`);
              // }

              if (leagueNames.indexOf(ev.tournamentSlug) > -1 && (ev.eventProgress.status === "RESULT" || ev.eventProgress.status === "LIVE")) {
                // if (team.eventOutcome === "undecided") {
                //   console.warn(JSON.stringify(team, null, 2));
                // }
                leagueEventsTemp.push(ev);
              }
            }));
          });
        } else {
          try {
            console.warn(JSON.stringify(responseData, null, 2));
          } catch (error) {
            console.warn(error);
          }
        }

        leagueEventsTemp.sort((a: Event, b: Event) => {
          if (a.startTime < b.startTime) {
            return -1;
          }
          if (a.startTime > b.startTime) {
            return 1;
          }
          // a must be equal to b
          return 0;
        });

        // setLeagueEvents(leagueEventsTemp);

        // setPoints2020(leagueEvents.map(le => getEventPoints(le)));
        pointsPerYear[year] = leagueEventsTemp.map(le => getEventPoints(le));
        pointsPerYear[year].unshift(0);

        eventsPerYear[year] = leagueEventsTemp;
        eventsPerYear[year].unshift({
          eventKey: "",
          startTime: "",
          isTBC: false,
          minutesElapsed: 0,
          minutesIntoAddedTime: 0,
          eventStatus: "",
          eventStatusNote: "",
          eventStatusReason: null,
          eventOutcomeType: "",
          eventType: "",
          seriesWinner: null,
          cpsId: "",
          cpsLive: "",
          homeTeam: {
            key: "1",
            scores: {
              score: 0,
              halfTime: 0,
              fullTime: 0,
              extraTime: 0,
              shootout: 0,
              aggregate: 0,
              aggregateGoalsAway: 0
            },
            formation: "",
            eventOutcome: EventOutcome.Loss,
            name: {
              first: selectedTeamNameInfoItem.fullName,
              full: selectedTeamNameInfoItem.fullName,
              abbreviation: selectedTeamNameInfoItem.fullName
            }
          },
          awayTeam: {
            key: "1",
            scores: {
              score: 1,
              halfTime: 1,
              fullTime: 1,
              extraTime: 1,
              shootout: 1,
              aggregate: 1,
              aggregateGoalsAway: 1
            },
            formation: "",
            eventOutcome: EventOutcome.Win,
            name: {
              first: selectedTeamNameInfoItem.fullName + "X",
              full: selectedTeamNameInfoItem.fullName + "X",
              abbreviation: selectedTeamNameInfoItem.fullName + "X"
            }
          },
          eventProgress: {
            period: "",
            status: "RESULT"
          },
          venue: {
            name: {
              first: "X",
              full: "X",
              abbreviation: "X"
            },
            homeCountry: "UK"
          },
          officials: [],
          tournamentInfo: "",
          eventActions: "",
          startTimeInUKHHMM: "",
          comment: "",
          href: "",
          tournamentName: {
            first: "X",
            full: "X",
            abbreviation: "X"
          },
          tournamentSlug: "",
        });

        if (year === maximumYear - 1) {
          setPointsPerYear(pointsPerYear);
          setEventsPerYear(eventsPerYear);

          setLoading(false);
        }
      }

      setPointsPerYear(pointsPerYear);
      setEventsPerYear(eventsPerYear);

      setLoading(false);
    };

    fetchMatchListData();

  }, [selectedTeamNameInfoItem]);

  const handleSelectedTeamChange = (event: any) => {
    const linkText = event.target.value;
    const nextItem: TeamNameInfo = {
      linkText,
      fullName: teamNameInfoItems.find(i => i?.linkText === linkText)?.fullName || "NA"
    };

    setSelectedTeamNameInfoItem(nextItem);
  }

  return (
    <div>
      {
        teamNameLinkTextItems &&
        // <ul>
        //   {teamNameLinkTextItems.map(name => <li key={name}>{name}</li>)}
        // </ul>
        <div style={{ textAlign: "center" }}>
          <select name="teamNameInfoItems" id="teamNameInfoItems" onChange={handleSelectedTeamChange} style={{ fontSize: "20pt" }} value={selectedTeamNameInfoItem.linkText}>
            {/* <option value="volvo">Volvo</option> */}
            {teamNameInfoItems.map(i => <option key={i?.linkText || 1} value={i?.linkText}>{i?.fullName}</option>)}
            {/* {selected={i?.linkText == selectedTeamNameInfoItem.linkText}} */}
          </select>
        </div>
      }
      {/* <pre>{JSON.stringify(selectedTeamNameInfoItem, null, 2)}</pre> */}

      {
        pointsPerYear && !loading &&
        <PointsLineChart
          pointsPerYear={pointsPerYear}
          eventsPerYear={eventsPerYear}
          minimumYear={minimumYear}
          maximumYear={maximumYear}
        />
      }

      {
        (!pointsPerYear || loading) &&
        // <p>
        //   Loading...
        // </p>
        <div style={{ display: 'flex', justifyContent: "center", alignItems: "center", height: "400px", border: "3px solid white" }}>
          <img src={logo} className="App-logo" alt="logo" />
        </div>
      }

      <div>
        {/* {points2020 &&
          <pre>{JSON.stringify(points2020, null, 2)}</pre>
        } */}

        {/* <ul>
            {leagueEvents &&
              leagueEvents.map(leagueEvent => <li key={leagueEvent.startTime}>
                {new Date(leagueEvent.startTime).toDateString()} : {leagueEvent.homeTeam.name.full} {leagueEvent.homeTeam.scores.fullTime} v {leagueEvent.awayTeam.scores.fullTime} {leagueEvent.awayTeam.name.full} : Points = [{getEventPoints(leagueEvent)}]
              </li>)
            }
          </ul> */}
      </div>
    </div>
  );
}

export default App;
