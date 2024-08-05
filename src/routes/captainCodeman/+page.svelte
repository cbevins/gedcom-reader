<script>
  import { createCombobox } from 'svelte-headlessui'
  import Transition from 'svelte-transition'
  import Selector from './Selector.svelte'
  import Check from './Check.svelte'

  import { createSwitch } from 'svelte-headlessui'

  // prettier-ignore
  const people = [
		{ name: 'Wade Cooper' },
		{ name: 'Arlene Mccoy' },
		{ name: 'Devon Webb' },
		{ name: 'Tom Cook' },
		{ name: 'Tanya Fox' },
		{ name: 'Hellen Schmidt' },
	]

  const combobox = createCombobox({ label: 'Actions', selected: people[2] })
  const sw = createSwitch({ label: 'Play Music' })

  function onChange(e) {
    console.log('select', e.detail.selected)
  }

  $: filtered = people.filter((person) =>
    person.name
      .toLowerCase()
      .replace(/\s+/g, '')
      .includes($combobox.filter.toLowerCase().replace(/\s+/g, '')),
  )
</script>
<div>
  <ul>
    <li><a href="/fileupdown">File Upload Download</a></li>
    <li><a href="/svelteHeadlessui">Svelte-Headless UI</a></li>
    <li><a href="/captainCodeman">Captain Codeman</a></li>
</ul>
</div>
<hr>

<div class="flex w-full flex-col items-center justify-center py-16">
  <button
    class="flex gap-2 rounded-md p-2 align-middle text-white outline-offset-2 {$sw.pressed
      ? 'bg-gray-400 hover:bg-gray-500 focus:outline-gray-500'
      : 'bg-green-600 hover:bg-green-700 focus:outline-green-700'}"
    use:sw.button
  >
    {#if $sw.pressed}
      <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>Pause</span>
    {:else}
      <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
        />
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>Play</span>
    {/if}
  </button>
</div>

<h1>Captain Codeman</h1>
<a href="https://captaincodeman.github.io/svelte-headlessui/listbox">Captain Codeman</a>
<div class="flex w-full flex-col items-center justify-center">
  <div class="fixed top-16 w-72">
    <div class="relative mt-1">
      <div
        class="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left text-sm shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300"
      >
        <input
          use:combobox.input
          on:change={onChange}
          class="w-full border-none py-2 pl-3 pr-10 leading-5 text-gray-900 focus:ring-0"
          value={$combobox.selected.name}
        />
        <!-- <span class="block truncate">{people[$listbox.selected].name}</span> -->
        <button
          use:combobox.button
          class="absolute inset-y-0 right-0 flex items-center pr-2"
          type="button"
        >
          <Selector class="h-5 w-5 text-gray-400" />
        </button>
      </div>

      <Transition
        show={$combobox.expanded}
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        on:after-leave={() => combobox.reset()}
      >
        <ul
          use:combobox.items
          class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        >
          {#each filtered as value}
            {@const active = $combobox.active === value}
            {@const selected = $combobox.selected === value}
            <li
              class="relative cursor-default select-none py-2 pl-10 pr-4 {active
                ? 'bg-teal-600 text-white'
                : 'text-gray-900'}"
              use:combobox.item={{ value }}
            >
              <span class="block truncate {selected ? 'font-medium' : 'font-normal'}"
                >{value.name}</span
              >
              {#if selected}
                <span
                  class="absolute inset-y-0 left-0 flex items-center pl-3 {active
                    ? 'text-white'
                    : 'text-teal-600'}"
                >
                  <Check class="h-5 w-5" />
                </span>
              {/if}
            </li>
          {:else}
            <li class="relative cursor-default select-none py-2 pl-10 pr-4 text-gray-900">
              <span class="block truncate font-normal">Nothing found</span>
            </li>
          {/each}
        </ul>
      </Transition>
    </div>
  </div>
</div>