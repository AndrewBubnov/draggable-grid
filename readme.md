React component to make CSS-grid markup items animated draggable without any additional
wrappers. Wrap grid items into the fully responsive `DragContainer` component instead of 
your regular grid container. Pass it a grid className and enjoy smooth drag-n-drop animation.

API:

index.ts exports two entities: `DragContainer` which is wrapper itself.
`DragContainer` takes one required prop `className` (grid container class name) and two optional ones:
 - `config` - saved on server or in any other way grid items layout (`Layout` type)
 - and `updateConfig` function, which, if passed, fired with every drag to save current config. 

Also, the `resetConfig` function which resets grid layout to default one: HTML markup in case if
`config` prop isn't passed and saved config else-way.

Project `App.tsx` component emulates optional props using the browser localStorage with delay of 1s
for presentational purposes.
