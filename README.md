# shouldideploy.today

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bhttps%3A%2F%2Fgithub.com%2Fbaires%2Fshouldideploy.svg?type=shield)](https://app.fossa.io/projects/git%2Bhttps%3A%2F%2Fgithub.com%2Fbaires%2Fshouldideploy?ref=badge_shield)

## Getting started

* Run:
    * `npm i` — install deps.
    * `npm run dev` start dev server
    * `now dev` if you need local serveless function (requires now)

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/baires/shouldideploy)

## Add new translations

For adding new language translations, see [docs/adding-languages.md](docs/adding-languages.md)

## API endpoint
There is an endpoint to use on your CI or just for fun at `https://shouldideploy.today/api`

You can also provide optional parameters to customize the API response:

- `tz`: The timezone to use when evaluating the date and time. The default value is UTC. Pass a valid timezone string, such as `America/New_York` or `Europe/London` default `UTC`.
- `date`: The date to evaluate. The default value is the current date. Pass a valid date string in the format `YYYY-MM-DD`, such as `2023-03-31`.
- `lang`: The language for the response message. Supports base languages (`en`, `es`, `pt`) and regional variants (`es-AR`). Falls back to base language or English if not found. Default is `en`.

### Examples

Get the default API response using the current date and time in the UTC timezone:


```
https://shouldideploy.today/api
```

Get the API response for a specific timezone (e.g., Europe/London):

```
https://shouldideploy.today/api?tz=Europe/London
```

Get the API response for a specific date (e.g., 2023-03-31) in the UTC timezone:

```
https://shouldideploy.today/api?date=2023-03-31
```

Get the API response for a specific date (e.g., 2023-03-31) in a specific timezone (e.g., America/New_York):

```
https://shouldideploy.today/api?tz=America/New_York&date=2023-03-31
```

Get the API response in Spanish:

```
https://shouldideploy.today/api?lang=es
```

Get the API response in Argentina Spanish with a specific timezone:

```
https://shouldideploy.today/api?lang=es-AR&tz=America/Buenos_Aires
```

## API Response

The API returns a JSON object containing the following keys:

- `timezone`: The timezone used for evaluating the date and time.
- `date`: The date provided as parameter in ISO format (YYYY-MM-DDTHH:mm:ss.sssZ)
- `shouldideploy`: A boolean value indicating whether you should deploy today or not.
- `message`: A string containing a reason or explanation for the `shouldideploy` result.

Example response:

```
{
  "timezone": "UTC",
  "date": "2023-03-31T00:00:00.000Z",
  "shouldideploy": false,
  "message": "It's Friday, better not deploy today."
}
```


## Community projects
 - [gustamms/devo-fazer-deploy-hoje](https://github.com/gustamms/devo-fazer-deploy-hoje) Versão brasileira do site https://shouldideploy.today/
 - [timelfrink/shouldideploy-action](https://github.com/timelfrink/shouldideploy-action) This action checks the website shouldideploy.today and stops deployments if the site tells us not to do so.
 - [panacaqui/should-i-deploy-today-discord-bot](https://github.com/panacaqui/should-i-deploy-today-discord-bot) A simple API to send a daily message from shouldideploy.today in a Discord channel.
 - [MatheusHAS/shouldideploytoday-for-pipeline](https://github.com/MatheusHAS/shouldideploytoday-for-pipeline) This example of implementation, consumes the shouldideploy.today API to decide on my pipeline if will be deploy process run or not.
 - [Brunomachadob/shouldideploy-slack](https://github.com/Brunomachadob/shouldideploy-slack) Should I Deploy Slack command
 - [gpalomar/shouldideploy-vscode](https://github.com/gpalomar/shouldideploy-vscode) A Visual Studio Code Extension that uses https://github.com/baires/shouldideploy 🍻⚠️

## Credits

Favicon created by [emilegraphics](https://thenounproject.com/search/?q=dot&i=1359410)

## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bhttps%3A%2F%2Fgithub.com%2Fbaires%2Fshouldideploy.svg?type=large)](https://app.fossa.io/projects/git%2Bhttps%3A%2F%2Fgithub.com%2Fbaires%2Fshouldideploy?ref=badge_large)
