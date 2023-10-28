import * as core from '@actions/core'
import { AlgorithmsService } from './service/AlgorithmService'
import { ProjectsService } from './service/ProjectService'

const algorithmsService = new AlgorithmsService()
const projectService = new ProjectsService(algorithmsService)

export async function run(): Promise<void> {
  try {
    console.log('herew')

    let repo = core.getInput('repo')
    let owner = core.getInput('owner')
    let branch = core.getInput('branch')
    console.log('2')
    console.log('repo, ', repo)
    console.log('owner, ', owner)
    console.log('branch, ', branch)

    await projectService.storeProject({ repo, owner, branch })
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
