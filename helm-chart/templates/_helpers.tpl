{{/*
Return the app name
*/}}
{{- define "myapp.name" -}}
node-app
{{- end }}

{{/*
Create a fullname using release name + app name
*/}}
{{- define "myapp.fullname" -}}
{{ .Release.Name }}-node-app
{{- end }}
