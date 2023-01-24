import View from "../View";

export default function ProfileView() {
  return (
    <View>
      <div className="profile-view">
        <Toolbar variant="dense" className="toolbar">
          <span className="toolbar__leftside">
            <IconButton edge="start" color="inherit" aria-label="menu">
              <Menu />
            </IconButton>
            <Typography
              className="toolbar__text"
              variant="p"
              color="inherit"
              component="div"
            >
              {gamestate.name}
            </Typography>
          </span>
        </Toolbar>
        <section className="profile">
          
        </section>
      </div>
    </View>
  );
}
