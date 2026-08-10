'use strict'

async function gatsbyRemarkMermaidWithFallback({ markdownAST, markdownNode }, options) {
  const { default: visitParents } = await import('unist-util-visit-parents')
  const { VFile } = await import('vfile')

  const instances = []
  visitParents(markdownAST, { type: 'code', lang: 'mermaid' }, (node, ancestors) => {
    instances.push([...ancestors, node])
  })

  if (!instances.length) {
    return
  }

  // Try the upstream plugin first; if Playwright cannot launch in this
  // environment, degrade to a plain text representation so the build still
  // produces usable output.
  try {
    const upstream = require('gatsby-remark-mermaid')
    await upstream({ markdownAST, markdownNode }, options)
    return
  } catch (error) {
    const isBrowserError =
      error &&
      typeof error.message === 'string' &&
      /browserType\.launch|Executable doesn't exist|error while loading shared libraries|Cannot find Chromium|Playwright/i.test(error.message)

    if (!isBrowserError) {
      throw error
    }

    console.warn(
      `[gatsby-remark-mermaid-jsdom] Playwright browser unavailable (${error.message}). Falling back to plain text mermaid blocks.`
    )
  }

  const vfile = new VFile({
    value: markdownNode.rawMarkdownBody,
    path: markdownNode.fileAbsolutePath,
  })

  for (const ancestors of instances) {
    const node = ancestors[ancestors.length - 1]
    const parent = ancestors[ancestors.length - 2]
    const nodeIndex = parent.children.indexOf(node)

    const fallback = options?.errorFallback
      ? options.errorFallback(node, new Error('Playwright browser unavailable'), vfile)
      : null

    if (fallback) {
      parent.children[nodeIndex] = fallback
    } else {
      // Preserve the diagram source as a readable preformatted block.
      parent.children[nodeIndex] = {
        type: 'code',
        lang: 'mermaid',
        value: node.value,
      }
    }
  }
}

module.exports = gatsbyRemarkMermaidWithFallback
