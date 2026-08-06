'use client'

import { useEffect, useState } from 'react'
import { Box, Group, Text } from '@mantine/core'
import { IconListSearch } from '@tabler/icons-react'
import classes from '../styles/TableOfContents.module.css'

export interface TableOfContentsLink {
  label: string
  id: string
}

interface TableOfContentsProps {
  links: TableOfContentsLink[]
  title?: string
}

export function TableOfContents({ links, title = 'Περιεχόμενα' }: TableOfContentsProps) {
  const [active, setActive] = useState(links[0]?.id ?? '')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id)
          }
        })
      },
      { rootMargin: '-96px 0px -70% 0px', threshold: 0 }
    )

    links.forEach((link) => {
      const element = document.getElementById(link.id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [links])

  const items = links.map((link) => (
    <Box<'a'>
      component="a"
      href={`#${link.id}`}
      onClick={(event) => {
        event.preventDefault()
        document.getElementById(link.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }}
      key={link.id}
      className={`${classes.link} ${active === link.id ? classes.linkActive : ''}`}
    >
      {link.label}
    </Box>
  ))

  return (
    <div>
      <Group mb="md">
        <IconListSearch size={18} stroke={1.5} />
        <Text>{title}</Text>
      </Group>
      {items}
    </div>
  )
}
