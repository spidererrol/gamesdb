# Games Database

## Single Player

If you want to track single player progress or status, create a private group with only your player as a member.

## Development

I develop using [Visual Studio Code][1] and the [Remote - Containers][2] extension

See `extensions` in `.devcontainer/devcontainer.json` for other extensions. I don't know if they are active from the [Remote - Containers][2] or if you need to also install then yourself.


### Dev Running

You will need to setup a MongoDB server (eg "mongo" docker image).
You will need to copy `.env.production` to `.env` and `gamesweb/.env.production` to `gamesweb/.env`.
Adjust `.env` to the correct url for your mongodb instance.

[1]: https://code.visualstudio.com/
[2]: https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers