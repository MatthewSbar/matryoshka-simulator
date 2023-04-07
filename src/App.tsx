import { useState } from "react";
import "./App.css";
import { formatAffixTierRoll, newAmulet } from "./consts";
import { Item } from "./types";

function App() {
  const [amulet, setAmulet] = useState<Item | null>();

  const generateAmulet = () => {
    setAmulet(newAmulet());
  };

  return (
    <div className='flex'>
      <div>
        {amulet && (
          <>
            <div className='item-frame'>
              <div className='item-header'>
                <div className='sides left'>
                  <div
                    className={`inf ${amulet.influence.toLocaleLowerCase()}`}
                  />
                </div>
                <div className='sides right'>
                  <div
                    className={`inf ${amulet.influence.toLocaleLowerCase()}`}
                  />
                </div>
                <div className='item-name'>Matryoshka Turn-in</div>
                <div className='item-base'>Onyx Amulet</div>
              </div>
              <div className='affixes'>
                <div className='property'>
                  Quality ({amulet?.quality} modifiers): +20%
                </div>
                <div className='sep' />
                <div className='property'>
                  Item level: <span className='value'>85</span>
                </div>
                <div className='property'>
                  Requires level: <span className='value'>25</span>
                </div>
              </div>
              <div className='sep' />
              {amulet?.anoints.map((a) => (
                <>
                  <div className='enchant'>Allocates {a.name}</div>
                  <div
                    className='property'
                    dangerouslySetInnerHTML={{
                      __html: a.description.replace(/\n/g, "<br>"),
                    }}
                  />
                </>
              ))}
              <div className='sep' />
              <div className='affix'>
                +
                {amulet.quality === "Attribute"
                  ? Math.floor(amulet.implicitRoll * 1.2)
                  : amulet.implicitRoll}{" "}
                to all Attributes
              </div>
              <div className='sep' />
              {amulet?.modifiers.map((m) => (
                <div className='affix'>
                  {formatAffixTierRoll(m, m.tags.includes(amulet.quality))}
                </div>
              ))}
              <div className='sep' />
              <div className='corrupted'>Corrupted</div>
              <div className='sep' />
              <div className='enchant'>Incubating Talisman Item</div>
            </div>
            <img src='/2d.png' />
          </>
        )}
      </div>
      <div className='App flex-2'>
        <img src='/card.png' />
        <button onClick={() => generateAmulet()}>Hand in</button>
      </div>
    </div>
  );
}

export default App;
