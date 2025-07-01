( function( blocks, element, components, blockEditor ) {
    var el = element.createElement;
    var registerBlockType = blocks.registerBlockType;
    var InspectorControls = blockEditor.InspectorControls;
    var PanelBody = components.PanelBody;
    var TextControl = components.TextControl;
    var SelectControl = components.SelectControl;

    registerBlockType( 'chess-puzzle/puzzle', {
        title: 'Chess Puzzle',
        icon: 'games',
        category: 'widgets',
        attributes: {
            width: { type: 'string', default: '400' },
            orientation: { type: 'string', default: 'auto' },
            pgn: { type: 'string' },
            fen: { type: 'string' },
            moves: { type: 'string' }
        },
        edit: function( props ) {
            var attrs = props.attributes;
            return [
                el( InspectorControls, {},
                    el( PanelBody, { title: 'Settings', initialOpen: true },
                        el( TextControl, {
                            label: 'Width (px)',
                            value: attrs.width,
                            onChange: function( val ) { props.setAttributes( { width: val } ); }
                        } ),
                        el( SelectControl, {
                            label: 'Orientation',
                            value: attrs.orientation,
                            options: [
                                { label: 'Auto', value: 'auto' },
                                { label: 'White', value: 'white' },
                                { label: 'Black', value: 'black' }
                            ],
                            onChange: function( val ) { props.setAttributes( { orientation: val } ); }
                        } ),
                        el( TextControl, {
                            label: 'PGN',
                            value: attrs.pgn,
                            onChange: function( val ) { props.setAttributes( { pgn: val } ); }
                        } ),
                        el( TextControl, {
                            label: 'FEN',
                            value: attrs.fen,
                            onChange: function( val ) { props.setAttributes( { fen: val } ); }
                        } ),
                        el( TextControl, {
                            label: 'Moves (e.g., e2e4,e7e5)',
                            value: attrs.moves,
                            onChange: function( val ) { props.setAttributes( { moves: val } ); }
                        } )
                    )
                ),
                el( 'p', {}, 'Chess Puzzle will appear here' )
            ];
        },
        save: function() {
            return null;
        }
    } );
} )( window.wp.blocks, window.wp.element, window.wp.components, window.wp.blockEditor );
