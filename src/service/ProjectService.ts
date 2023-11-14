/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable filenames/match-regex */

import { ProjectsDTO } from './dto'
import { exec } from 'child_process'
import csv2json from 'csvtojson'
import 'dotenv/config'
import { exec as actionExec } from '@actions/exec'
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

    const file = await this.downloadFiles(projectDto)

    const zipFile = 'master.zip'
    const fileUrl = file.url

    await this.writeCsvToMaster(fileUrl, zipFile)

    // await this.downloadSrcml()
    // await this.installSrcml()

    await actionExec('ls')
    await actionExec('pwd')
    await actionExec('python --version')
    await actionExec('python3 --version')
    await actionExec('pip show pandas')
    await actionExec('srcml')
    await this.convertToSrcml()

    const tag = '000i'

    await this.extractIdentifiers(tag)

    // await this.downloadDependencies(tag)

    // setTimeout(async () => {
    //   await this.installPythonDependencies()
    // }, 10000)

    await this.applyCategory(tag)

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

  private async downloadDependencies(tag: string): Promise<void> {
    await this.algorithmsService.downloadDependencies(tag)
  }

  private async applyCategory(tag: string): Promise<void> {
    console.log('Aplicando algoritmo categorias')
    await this.algorithmsService.applyCategoryAlgorithm(tag)
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

  // private async downloadSrcml(): Promise<void> {
  //   return new Promise(async response => {
  //     setTimeout(() => {
  //       exec(
  //         'wget http://131.123.42.38/lmcrs/v1.0.0/srcml_1.0.0-1_ubuntu20.04.deb',
  //         error => {
  //           if (error) {
  //             console.log(error)
  //             process.exit(1)
  //           } else {
  //             console.log('Download srcml done')
  //           }
  //         }
  //       )
  //       response()
  //     }, 10000)
  //   })
  // }

  // private async installSrcml(): Promise<void> {
  //   console.log('not installsrcml')

  //   return new Promise(async response => {
  //     setTimeout(() => {
  //       exec('sudo dpkg -i srcml_1.0.0-1_ubuntu20.04.deb', error => {
  //         if (error) {
  //           console.log(error)
  //           process.exit(1)
  //         } else {
  //           console.log('Install srcml done')
  //         }
  //       })
  //       response()
  //     }, 8000)
  //   })
  // }

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

  private async extractIdentifiers(tag: string): Promise<void> {
    return new Promise(async response => {
      setTimeout(() => {
        PythonShell.run(
          `/home/runner/work/_actions/Remoliveira/id-analyzer-action3/${tag}/dist/Java.py`
        ).then(messages => {
          console.log(messages, 'extract identifiers finished')
        })

        response()
      }, 2000)
    })
  }

  //   private async installPythonDependencies(): Promise<void> {
  //     console.log('install pandas')

  //     // return new Promise(async response => {
  //     //   setTimeout(() => {
  //     //     exec('pip install pandas', error => {
  //     //       if (error) {
  //     //         console.log(error)
  //     //         process.exit(1)
  //     //       } else {
  //     //         console.log('Install pandas done')
  //     //       }
  //     //     })
  //     //     response()
  //     //   }, 10000)
  //       // setTimeout(() => {
  //       //   exec('pip3 -m install gensin.downloader', error => {
  //       //     if (error) {
  //       //       console.log(error)
  //       //       process.exit(1)
  //       //     } else {
  //       //       console.log('Install srcml done')
  //       //     }
  //       //   })
  //       //   response()
  //       // }, 8000)
  //     })
  //   }
}

export { ProjectsService }
