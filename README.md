### название суть приложухи и прочее поменять
[![Actions Status](https://github.com/SofiaPechkur/frontend-project-46/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/SofiaPechkur/frontend-project-46/actions)
[![tests & lint](https://github.com/SofiaPechkur/frontend-project-46/actions/workflows/tests&lint.yml/badge.svg)](https://github.com/SofiaPechkur/frontend-project-46/actions/workflows/tests&lint.yml)
[![Maintainability](https://api.codeclimate.com/v1/badges/68949f69fd3413a06235/maintainability)](https://codeclimate.com/github/SofiaPechkur/frontend-project-46/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/68949f69fd3413a06235/test_coverage)](https://codeclimate.com/github/SofiaPechkur/frontend-project-46/test_coverage)
## Setup
```bash
make install
```
## Run help
```bash
gendiff -h
```
## Run utility
Format stylish:
```bash
gendiff filepath1.json filepath2.json
```
Format plain:
```bash
gendiff --format plain filepath1.json filepath2.json
```
Format JSON:
```bash
gendiff --format json filepath1.json filepath2.json
```
This repository contains utility which can be used to find the difference between two files. Acceptable file format: .json, .yml. The result is available in three formats: stylish, plain, JSON.
### Gendiff
[![asciicast](https://asciinema.org/a/687241.svg)](https://asciinema.org/a/687241)