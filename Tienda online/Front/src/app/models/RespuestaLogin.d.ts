export interface RespuestaLogin {
  headers:    Headers;
  status:     number;
  statusText: string;
  url:        string;
  ok:         boolean;
  type:       number;
  body:       Body;
}

export interface Body {
  Authorization: string;
}

export interface Headers {
  normalizedNames: NormalizedNames;
  lazyUpdate:      null;
}

export interface NormalizedNames {
}
