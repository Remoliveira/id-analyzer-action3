/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable filenames/match-regex */

import { ProjectsDTO } from './dto'
import { exec } from 'child_process'
import csv2json from 'csvtojson'
import 'dotenv/config'

import { Octokit } from '@octokit/rest'
import * as request from 'superagent'

import { createWriteStream } from 'fs'
import { AlgorithmsService } from './AlgorithmService'

import { PythonShell } from 'python-shell'

interface ProjectResponse {
  categoryJson: unknown
  wcmJson: unknown
  word2vecJson: unknown
}

class ProjectsService {
  constructor(private algorithmsService: AlgorithmsService) {}
  async storeProject(projectDto: ProjectsDTO): Promise<any> {
    this.algorithmsService = new AlgorithmsService()
    console.log('antes', projectDto)
    const file = await this.downloadFiles(projectDto)
    console.log('filed?', file)
    const zipFile = 'master.zip'
    console.log('filed url?', file.url)
    const fileUrl = file.url

    await this.writeCsvToMaster(fileUrl, zipFile)

    await this.convertToSrcml()

    await this.extractIdentifiers()

    await this.downloadDependencies()

    await this.applyCategory()

    // MUDAR ISSO \/
    // await this.applyWord2vec()

    setTimeout(async () => {
      await this.setCategoryJson()
      await this.setPhoneticJson()
    }, 1000)
  }

  private async downloadFiles(projectDto: ProjectsDTO): Promise<any> {
    try {
      const octokit = new Octokit({
        auth: process.env.GITHUB_TOKEN
      })
      console.log('dto', projectDto)
      console.log('3')
      console.log(projectDto.repo)
      const file = await octokit.request(
        `GET /repos/{owner}/{repo}/zipball/{ref}`,
        {
          owner: projectDto.owner,
          repo: projectDto.repo,
          ref: projectDto.branch
        }
      )

      return file
    } catch (error) {
      return error
    }
  }

  private async writeCsvToMaster(
    fileUrl: string,
    zipFile: string
  ): Promise<void> {
    return new Promise(async response => {
      setTimeout(() => {
        request
          .get(fileUrl)
          .on('error', function (error) {
            console.log(error)
          })
          .pipe(createWriteStream(zipFile))
          .on('finish', function () {})
        response()
      }, 2000)
    })
  }

  private async downloadDependencies() {
    await this.algorithmsService.downloadDependencies()
    console.log('dependencias baixadas')
  }

  private async applyCategory() {
    console.log('Aplicando algoritmo categorias')
    await this.algorithmsService.applyCategoryAlgorithm()
  }

  private async applyWord2vec() {
    await this.algorithmsService.applyWordEmbeddingAlgorithm()
  }

  private async setCategoryJson() {
    const result = await this.algorithmsService.setCategoryJson()
    return result
  }

  private async setPhoneticJson() {
    const result = await this.algorithmsService.setPhoneticJson()
    return result
  }

  private async convertToSrcml(): Promise<void> {
    return new Promise(async response => {
      setTimeout(() => {
        exec('srcml --verbose master.zip -o master.xml', error => {
          if (error) {
            console.log(error)
            process.exit(1)
          } else {
            console.log('Convert do srcml done')
          }
        })
        response()
      }, 2000)
    })
  }

  private async extractIdentifiers(): Promise<void> {
    return new Promise(async response => {
      setTimeout(() => {
        PythonShell.run('Java.py').then(messages => {
          console.log(messages, 'extract identifiers finished')
        })

        response()
      }, 2000)
    })
  }
}

export { ProjectsService }
