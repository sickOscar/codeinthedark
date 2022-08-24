# Code in the dark | Venice Edition

This is the main server for the [Venice Edition](https://codeinthedark.interlogica.it)

## Setup

```
npm install
npm start
```

## Usage

### APIs access
All the services talks to this server via a common api. Once started, it could be found at http://localhost:3000


### Admin interface

Admin interface (SSR) is available at http://localhost:3000/hippos


___

## Timing sockets reference
Broadcast sockets to control round timing
```
Message format
{
    type: 'MESSAGE_TYPE'
    data: 'MESSAGE_PAYLOAD'
}
```

### Message types

#### EVENT COUNTDOWN 
```
{
    type: 'EVENT_COUNTDOWN'
    data: {missing: '', time: 0}
}
```

#### ROUND COUNTDOWN 
```
{
    type: 'ROUND_COUNTDOWN'
    data: {round: _id, missing: '', time: 0}
}
```

#### ROUND_END_COUNTDOWN
```
{
    type: 'ROUND_END_COUNTDOWN'
    data: {round: _id, missing: '', time: 0, countdownStep: 1}
}
```



#### VOTE_COUNTDOWN
```
{
    type: 'VOTE_COUNTDOWN',
    data: {round: _id, missing: '', time: 0}
}
```

#### RECEIVING_RESULTS
```
{
    type: 'RECEIVING_RESULTS',
    data: {round: _id}
}
```

#### SHOWING RESULTS
```
{
    type: 'SHOWING_RESULTS',
    data: {
        round: _id
    }
}
```

#### WAITING
```
{
    type: 'WAITING',
    data: {
        round: _id
    }
}
```

