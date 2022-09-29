import { NextPage } from "next";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { HOST, UserContext } from "../../components/context/app.context";

export interface Round {
  id: number,
  name: string,
  layout_url: string,
  players: Player[]
}

export interface Player {
  id: number,
  voted: boolean,
  name: string,
  fullname: string,
  data: string | null,
}

//-----------------------------------------------------
//
// List item renderer
//
//-----------------------------------------------------

type PlayerProps = {
  player: Player;
  handler: (name: number) => void;
};

const PlayerItem = ({ player, handler }: PlayerProps) => {

  return (
    <div onClick={() => handler(player.id)} className="relative mb-4">
      <img
        className="max-w-full h-auto"
        alt="player preview layout"
        src={player.data ?? "/no-image.png"}
      />
      <h2 className="text-2xl bg-black p-2 absolute bottom-10">
        {player.fullname}
      </h2>
      {player.voted && (
        <img
          alt="voted icon"
          src="/voted.png"
          className="absolute bottom-10 right-2 w-16 h-16"
        />
      )}
    </div>
  );
};

//-----------------------------------------------------
//
// Page component
//
//-----------------------------------------------------

const RoundVotingPage: NextPage = () => {

  const router = useRouter()
  const { id } = router.query;

  const user = useContext(UserContext);

  const [votedEnabled, setVotedEnabled] = useState<boolean>(false);
  const [round, setRound] = useState<Round>({ id: 0, name: "", players: [], layout_url: "" });
  const [playerId, setPlayerId] = useState<number>(-1);

  useEffect(() => {
    if (!id) return;
    fetch(HOST + 'round/' + id)
      .then(response => response.json())
      .then(r => {
        setRound({ ...round, ...r });
      });
  }, [id]);

  const voteHandler = (votedId: number): void => {
    setPlayerId(votedId)
    const ps = round.players.map((p) => {
      p.voted = false;
      if (p.id === votedId) {
        p.voted = true;
      }
      return p;
    });
    setRound({ ...round, ...{ players: ps } });
    setVotedEnabled(true);
  };

  const onSubmitVote = () => {
    const voteURL = HOST + 'vote/' + id + '/' + playerId;

    fetch(voteURL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        uuid: user?.username
      })
    })
      .then(resp => {
        if (resp.status !== 200) {
          router.push("/cantvoteagain");
        }
        else {
          router.push("/thanks");
        }
      })
      .then(response => {
        // TO ASK = x' tenere nello stato i voti fatti?
        //state.votes[state.currentRound._id] = +new Date();
      })
  }


  return (
    <div className="relative fullview">
      <div className="absolute top-64 bottom-12 left-0 right-0 overflow-auto">
        {round.players.map((player) => {
          return (
            <PlayerItem
              key={player.fullname}
              player={player}
              handler={voteHandler}
            />
          );
        })}
        <div className="w-auto h-28">&nbsp;</div>
      </div>

      <div className="fixed top-0 left-0 right-0 bg-black h-62 overflow-hidden ">
        <h2 className="text-center p-2">Best 4U in round **{round.name}**?</h2>
        <img
          src={encodeURI(round.layout_url || "/no-image.png")}
          className="max-w-full h-auto"
          alt="result layout preview"
        />
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-black h-10">
        <button
          type="button"
          className=" text-black font-bold w-full text-center p-2 disabled:opacity-30 bg-screengreen-500"
          disabled={!votedEnabled}
          onClick={onSubmitVote}
        >
          <span>Ok vote my loved now!</span>
        </button>
      </div>
    </div>
  );
};

export default RoundVotingPage;
