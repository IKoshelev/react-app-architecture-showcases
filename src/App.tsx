import React from 'react';
import { observer } from 'mobx-react';

import { CarPurchase } from './car-purchase/vm/CarPurchase';
import { appVm } from './App.VM';

import './App.css';

const App = observer(() => {
  return <div id='app-root'>

    <div className='car-purchase-main-logo'>
      Welcome to Crazy Ivan Motors
    </div>

    <div className='tabs'>
      <button
        className='button-add-new-deal'
        onClick={appVm.addNewDeal}
      >
        Add deal
      </button>
      {
        appVm.capPurchaseVMs.map(x => (
          <div
            className={`deal-tab-header ${x === appVm.activeCapPurchaseVM ? 'active' : ''}`}
            key={x.id}
            onClick={() => appVm.setActiveDeal(x)}
          >
            {x.id}
          </div>
        ))
      }
    </div>

    <CarPurchase vm={appVm.activeCapPurchaseVM}></CarPurchase>

  </div>

});

export default App;