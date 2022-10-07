import { NextPage } from "next";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { HOST, UserContext } from "../../components/app-context-wrapper";
import { useNotAuthenticated } from "../../customhook/useAuthenticated";

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
  preview_url: string | null,
  full_preview_url: string | null,
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
    <div onClick={() => handler(player.id)} className="relative mt-2 mb-2 border-basic border-white">
      <img
        className="max-w-full w-full h-auto"
        alt="player preview layout"
        src={player.preview_url ?? "/no-image.png"}
      />
      <p className=" text-black bg-citd-purple p-1 absolute bottom-0 left-0">
        {player.fullname}
      </p>
      {player.voted && (
        <img
          alt="voted icon"
          src="/voted.png"
          className="absolute bottom-0 right-0 w-14 h-14"
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

  useNotAuthenticated();

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

    localStorage.setItem("voted", JSON.stringify(true));

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
  }

  //

  return (
    <div className="text-center h-full p-4 flex flex-col overflow-y-auto">

      <div className="bg-black h-62 max-h-62 lg:max-h-64 mb-1 overflow-hidden">
        <h2 className="text-center p-2 mb-4 text-citd-cyan uppercase">Best 4U in round <span className="text-white">{round.name}</span>?</h2>
        <div className="max-h-42 border-basic border-white relative">
          <img
            src={encodeURI(round.layout_url || "/no-image.png")}
            className="w-full h-auto  border-0"
            alt="challange layout preview"
          />
          <div className="bg-citd-purple absolute pl-2 pr-2 top-0 left-0">reference</div>
        </div>
      </div>


      <div className="flex-1 overflow-y-auto">
        {round.players.map((player) => {
          return (
            <PlayerItem
              key={player.name}
              player={player}
              handler={voteHandler}
            />
          );
        })}
        <div className="w-auto h-60">&nbsp;</div>
      </div>


      <div className="bg-black h-20 pt-2">
        <button
          type="button"
          className="font-bold w-full text-center p-2 rounded-md bg-citd-cyan text-black disabled:opacity-30"
          disabled={!votedEnabled}
          onClick={onSubmitVote}
        >
          <span>Vote your champ</span>
        </button>
      </div>
    </div>
  );
};

export default RoundVotingPage;
