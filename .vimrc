set nocompatible              " be iMproved, required
filetype off                  " required

" Vundle Plugins
set rtp+=~/.vim/bundle/Vundle.vim
call vundle#begin()

Plugin 'gmarik/Vundle.vim'
Plugin 'tpope/vim-fugitive'
Plugin 'scrooloose/nerdtree'
Plugin 'jistr/vim-nerdtree-tabs'
Plugin 'kien/ctrlp.vim'
Plugin 'bling/vim-airline'
Plugin 'tpope/vim-surround'
Plugin 'derekwyatt/vim-scala'
Plugin 'vim-ruby/vim-ruby'
Plugin 'rodjek/vim-puppet'
Plugin 'flazz/vim-colorschemes'
Plugin 'ervandew/supertab'
Plugin 'scrooloose/nerdcommenter'
Plugin 'bronson/vim-trailing-whitespace'
Plugin 'godlygeek/tabular'
Plugin 'fatih/vim-go'
Plugin 'nsf/gocode', {'rtp': 'vim/'}
Plugin 'rking/ag.vim'

call vundle#end()

filetype on
syntax on
filetype plugin on
filetype indent on

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

if has("mouse")
    set mouse=a
endif

" Color & Theme
set t_Co=256
let g:solarized_termcolors=256
"colorscheme hybrid
"colorscheme jelleybeans
"colorscheme solarized
colorscheme peachpuff

let g:airline#extensions#tabline#left_sep = ' '
let g:airline#extensions#tabline#left_alt_sep = '|'
let g:airline_seciont_b = '%{strftime("%c")}'
let g:airline_section_y = 'BN: %{bufnr("%")}'
let g:airline_detect_whitespace=0
let mapleader = ","

" NerdTree mapping
nmap <leader>ne :NERDTreeTabsToggle<CR>
nmap <leader>nf :NERDTreeFind <BAR> NERDTreeTabsOpen<CR>

" Use ctrl-[hjkl] to select the active split!
nmap <silent> <c-k> :wincmd k<CR>
nmap <silent> <c-j> :wincmd j<CR>
nmap <silent> <c-h> :wincmd h<CR>
nmap <silent> <c-l> :wincmd l<CR>

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
