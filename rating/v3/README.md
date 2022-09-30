# Code in the dark rating app

## Setup app notes

- `pnpm create next-app --ts`: crate basic nextjs app
- add deps
  - react-native-web
- add dev-deps
  - _@types/react-native_ (not found @types/react-native-web... but it seems to be working :disappointed_relieved:)
  - _babel-plugin-module-resolver_ (see babel configuration)
- add .babelrc ([info](https://necolas.github.io/react-native-web/docs/setup/)): useful in import ("react-native" instead of "react-native-web") for potential sharing with native app
