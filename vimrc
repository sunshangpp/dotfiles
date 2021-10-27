set nocompatible              " be iMproved, required
filetype off                  " required

call plug#begin('~/.vim/plugged')
Plug 'tpope/vim-fugitive'
Plug 'scrooloose/nerdtree'
Plug 'jistr/vim-nerdtree-tabs'
Plug 'kien/ctrlp.vim'
Plug 'scrooloose/syntastic'
Plug 'bling/vim-airline'
Plug 'tpope/vim-surround'
Plug 'flazz/vim-colorschemes'
Plug 'ervandew/supertab'
Plug 'scrooloose/nerdcommenter'
Plug 'bronson/vim-trailing-whitespace'
Plug 'godlygeek/tabular'
Plug 'rking/ag.vim'
Plug 'christoomey/vim-tmux-navigator'
Plug 'Valloric/YouCompleteMe'
"Plug 'derekwyatt/vim-scala'
"Plug 'vim-ruby/vim-ruby'
"Plug 'rodjek/vim-puppet'
"Plug 'fatih/vim-go'
"Plug 'nsf/gocode', {'rtp': 'vim/'}
call plug#end()

filetype on
syntax on

" Settings
set shell=/bin/bash
set number
set ruler
set ls=2            " always display filename on the ruler
set nowrap          " let the world see long lines for what they are
set backspace=2     " normal backspace behavior
set encoding=utf-8
set hlsearch
set autoindent
set smarttab
set background=dark
set clipboard=unnamed
set expandtab      " default to soft tabs, 2 spaces
set sw=2
set sts=2
set splitright
set splitbelow
set tabstop=4

if has("mouse")
    set mouse=a
endif

" Color & Theme
set t_Co=256
let g:solarized_termcolors=256
"colorscheme hybrid
"colorscheme jelleybeans
"colorscheme solarized
"colorscheme peachpuff
"colorscheme Tomorrow-Night-Eighties
"colorscheme icefall
"colorscheme obsidian

" Lint settings
let g:syntastic_puppet_checkers=['']
let g:syntastic_scala_checkers=['']

let g:airline#extensions#tabline#left_sep = ' '
let g:airline#extensions#tabline#left_alt_sep = '|'
let g:airline_seciont_b = '%{strftime("%c")}'
let g:airline_section_y = 'BN: %{bufnr("%")}'
let g:airline_detect_whitespace=0
let mapleader = ","

let g:SuperTabDefaultCompletionType = "<C-X><C-O>"
let g:SuperTabDefaultCompletionType = "context"

" NerdTree mapping
nmap <leader>ne :NERDTreeTabsToggle<CR>
nmap <leader>nf :NERDTreeFind <BAR> NERDTreeTabsOpen<CR>

" syntastic settings
set statusline+=%#warningmsg#
set statusline+=%{SyntasticStatuslineFlag()}
set statusline+=%*
let g:syntastic_always_populate_loc_list = 1
let g:syntastic_auto_loc_list = 1
let g:syntastic_check_on_open = 1
let g:syntastic_check_on_wq = 0

" Use ctrl-[hjkl] to select the active split!
"nmap <silent> <c-k> :wincmd k<CR>
"nmap <silent> <c-j> :wincmd j<CR>
"nmap <silent> <c-h> :wincmd h<CR>
"nmap <silent> <c-l> :wincmd l<CR>

" Quick save
noremap <silent> <C-S>          :update<CR>
vnoremap <silent> <C-S>         <C-C>:update<CR>
inoremap <silent> <C-S>         <C-O>:update<CR>

" Cursor movement mapping
nmap <c-a> ^
nmap <c-e> $
vmap <c-a> ^
vmap <c-e> $
imap <c-a> <c-O>^
imap <c-e> <c-O>$
nmap <c-d> 10j
nmap <c-u> 10k
vmap <c-d> 10j
vmap <c-u> 10k

" Keep the current visual block selection active after changing indent
vmap > >gv
vmap < <gv
